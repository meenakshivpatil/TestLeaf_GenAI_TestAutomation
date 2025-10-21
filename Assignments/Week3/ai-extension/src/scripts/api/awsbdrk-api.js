class AwsbdrkAPI {
    constructor(apiKey) {
      this.apiKey = apiKey;
     // this.baseUrl = 'https://bedrock-runtime.us-east-1.amazonaws.com/model/openai.gpt-oss-20b-1:0/invoke';
      this.baseUrl = 'https://bedrock-runtime.us-east-1.amazonaws.com/model/';
      console.log('AwsbdrkAPI initialized with baseUrl:', this.baseUrl);
    }
  
    // Helper function to extract the entire code block (including the delimiters)
    extractBlock(text) {
      const regex = /```[\s\S]*?```/g;
      const matches = text.match(regex);
      if (matches && matches.length > 0) {
        return matches.map(block => block.trim()).join('\n\n');
      }
      return text;
    }       
  
    async sendMessage(prompt, modelName) {
      const url = `${this.baseUrl}${modelName}/invoke`;
      console.log('Sending request to URL:', url);
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: [{
              role: 'user',
              content: prompt
            }],
            temperature: 0.2
          })
        });
  
        if (!response.ok) {
          const errorData = await response.text();
          console.error('API Response:', response.status, errorData);
          throw new Error(`API call failed: ${response.status} - ${errorData}`);
        }
  
        const data = await response.json();
        console.log('Awsbdrk API response:', data);
  
        // Extract the entire code block (with ``` and closing ```)
        //const rawContent = data.results[0].outputText;
        const rawContent = data.choices[0].message.content;
        const responseContent = this.extractBlock(rawContent);
  
        return {
          content: responseContent
        };
      } catch (error) {
        console.error('Error calling aws-bdrk API:', error);
        throw error;
      }
    }
}
// Make the class available globally
window.AwsbdrkAPI = AwsbdrkAPI;