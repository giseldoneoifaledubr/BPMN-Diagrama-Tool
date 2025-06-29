import { GroqSettings, DiagramModification } from '../types/chat';
import { BPMNDiagram } from '../types/bpmn';

export interface GroqModel {
  id: string;
  name: string;
  description: string;
  context_window?: number;
  owned_by?: string;
}

export class GroqService {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://api.groq.com/openai/v1';

  constructor(settings: GroqSettings) {
    this.apiKey = settings.apiKey;
    this.model = settings.model;
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.apiKey) {
      return { success: false, message: 'API key is required' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'user', content: 'Hello! This is a test message.' }
          ],
          max_tokens: 10,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: `API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}` 
        };
      }

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return { success: true, message: 'Connection successful! API is working correctly.' };
      } else {
        return { success: false, message: 'Unexpected response format from API' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async getAvailableModels(): Promise<{ success: boolean; models?: GroqModel[]; message?: string }> {
    if (!this.apiKey) {
      return { success: false, message: 'API key is required' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: `API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}` 
        };
      }

      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        const models: GroqModel[] = data.data
          .filter((model: any) => model.id && model.id.includes('llama') || model.id.includes('mixtral') || model.id.includes('gemma'))
          .map((model: any) => ({
            id: model.id,
            name: this.formatModelName(model.id),
            description: this.getModelDescription(model.id),
            context_window: model.context_window,
            owned_by: model.owned_by,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        return { success: true, models };
      } else {
        return { success: false, message: 'Unexpected response format from models API' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to fetch models: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  private formatModelName(modelId: string): string {
    const nameMap: Record<string, string> = {
      'llama-3.1-70b-versatile': 'Llama 3.1 70B (Versatile)',
      'llama-3.1-8b-instant': 'Llama 3.1 8B (Instant)',
      'llama3-70b-8192': 'Llama 3 70B',
      'llama3-8b-8192': 'Llama 3 8B',
      'mixtral-8x7b-32768': 'Mixtral 8x7B',
      'gemma2-9b-it': 'Gemma 2 9B',
      'gemma-7b-it': 'Gemma 7B',
    };

    return nameMap[modelId] || modelId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private getModelDescription(modelId: string): string {
    const descriptionMap: Record<string, string> = {
      'llama-3.1-70b-versatile': 'Best balance of speed and capability - Recommended',
      'llama-3.1-8b-instant': 'Fastest response times with good quality',
      'llama3-70b-8192': 'High capability model with large context',
      'llama3-8b-8192': 'Fast and efficient for most tasks',
      'mixtral-8x7b-32768': 'Excellent for complex reasoning tasks',
      'gemma2-9b-it': 'Efficient and capable instruction-tuned model',
      'gemma-7b-it': 'Lightweight instruction-tuned model',
    };

    return descriptionMap[modelId] || 'AI language model';
  }

  async sendMessage(message: string, diagram: BPMNDiagram): Promise<{ response: string; modifications: DiagramModification[] }> {
    if (!this.apiKey) {
      throw new Error('Groq API key is required');
    }

    const systemPrompt = this.buildSystemPrompt(diagram);
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.1,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || '';

      // Parse the response to extract modifications
      const modifications = this.parseModifications(assistantMessage);
      const cleanResponse = this.cleanResponse(assistantMessage);

      return {
        response: cleanResponse,
        modifications,
      };
    } catch (error) {
      console.error('Groq API error:', error);
      throw error;
    }
  }

  private buildSystemPrompt(diagram: BPMNDiagram): string {
    const diagramDescription = this.describeDiagram(diagram);
    
    return `You are an AI assistant that helps users modify BPMN diagrams through natural language. 

Current diagram state:
${diagramDescription}

You can perform the following actions:
1. Add elements (start, task, gateway, end)
2. Remove elements
3. Modify element labels
4. Add connections between elements
5. Remove connections
6. Add pools (containers for organizing elements by participants)
7. Remove pools
8. Modify pools (name, size, color)
9. Add lanes within pools
10. Remove lanes from pools
11. Clear the entire diagram

When responding, you should:
1. Provide a natural language response explaining what you're doing
2. Include modification commands in a specific JSON format at the end of your response

Modification format:
[MODIFICATIONS]
{
  "modifications": [
    {
      "type": "add_element",
      "elementType": "task",
      "position": {"x": 200, "y": 100},
      "label": "New Task",
      "poolId": "pool-id-optional"
    },
    {
      "type": "add_pool",
      "poolName": "Customer Pool",
      "position": {"x": 100, "y": 50},
      "poolSize": {"width": 500, "height": 300},
      "poolColor": "#3B82F6"
    }
  ]
}
[/MODIFICATIONS]

Available modification types:
- add_element: elementType (start|task|gateway|end), position {x, y}, label, poolId (optional)
- remove_element: elementId
- modify_element: elementId, label
- add_connection: sourceId, targetId, connectionLabel (optional)
- remove_connection: sourceId, targetId
- add_pool: poolName, position {x, y}, poolSize {width, height} (optional), poolColor (optional)
- remove_pool: poolId
- modify_pool: poolId, poolName (optional), poolSize (optional), poolColor (optional)
- add_lane: poolId, laneName
- remove_lane: poolId, laneId
- clear_diagram: (no additional parameters)

Position guidelines:
- Canvas is approximately 1200x800 pixels
- Start elements typically at x: 100-200, y: 200-400
- Space elements about 150-200 pixels apart horizontally
- Keep vertical spacing around 100-150 pixels
- Pools should be large enough to contain elements (minimum 400x200)
- Place pools with some spacing between them

Pool guidelines:
- Use pools to represent different participants, organizations, or departments
- Elements can be placed inside pools by specifying poolId
- Pools can have multiple lanes to further organize elements
- Common pool colors: #3B82F6 (blue), #10B981 (green), #F59E0B (yellow), #EF4444 (red), #8B5CF6 (purple)

Always respond in a helpful, conversational manner and explain what changes you're making to the diagram.`;
  }

  private describeDiagram(diagram: BPMNDiagram): string {
    if (diagram.elements.length === 0 && diagram.pools.length === 0) {
      return "The diagram is currently empty.";
    }

    let description = `The diagram "${diagram.name}" contains:\n`;
    
    // Describe pools
    if (diagram.pools.length > 0) {
      description += "Pools:\n";
      diagram.pools.forEach(pool => {
        description += `- Pool "${pool.name}" (ID: ${pool.id}) at position (${pool.position.x}, ${pool.position.y}) with size ${pool.size.width}x${pool.size.height}\n`;
        if (pool.lanes && pool.lanes.length > 0) {
          pool.lanes.forEach(lane => {
            description += `  - Lane "${lane.name}" (ID: ${lane.id})\n`;
          });
        }
      });
      description += "\n";
    }
    
    // Describe elements
    if (diagram.elements.length > 0) {
      description += "Elements:\n";
      diagram.elements.forEach(element => {
        const poolInfo = element.poolId ? ` in pool ${element.poolId}` : ' (not in any pool)';
        description += `- ${element.type} "${element.label}" (ID: ${element.id}) at position (${element.position.x}, ${element.position.y})${poolInfo}\n`;
      });
    }

    // Describe connections
    if (diagram.connections.length > 0) {
      description += "\nConnections:\n";
      diagram.connections.forEach(connection => {
        const sourceElement = diagram.elements.find(e => e.id === connection.source);
        const targetElement = diagram.elements.find(e => e.id === connection.target);
        const label = connection.label ? ` labeled "${connection.label}"` : '';
        description += `- From "${sourceElement?.label}" to "${targetElement?.label}"${label}\n`;
      });
    } else if (diagram.elements.length > 0) {
      description += "\nNo connections between elements.\n";
    }

    return description;
  }

  private parseModifications(response: string): DiagramModification[] {
    try {
      const modificationMatch = response.match(/\[MODIFICATIONS\](.*?)\[\/MODIFICATIONS\]/s);
      if (!modificationMatch) {
        return [];
      }

      const jsonStr = modificationMatch[1].trim();
      const parsed = JSON.parse(jsonStr);
      return parsed.modifications || [];
    } catch (error) {
      console.error('Error parsing modifications:', error);
      return [];
    }
  }

  private cleanResponse(response: string): string {
    return response.replace(/\[MODIFICATIONS\].*?\[\/MODIFICATIONS\]/s, '').trim();
  }
}