import { config } from '../config/env';

interface ContentExtractionResult {
  content: string;
  title: string;
  success: boolean;
  error?: string;
}

export const extractPDFContent = async (file: File): Promise<ContentExtractionResult> => {
  try {
    console.log("file: ", file);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${config.backend.url}/extract/pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      content: '',
      title: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const extractURLContent = async (url: string): Promise<ContentExtractionResult> => {
  try {
    const response = await fetch(`${config.backend.url}/extract/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('URL extraction error:', error);
    return {
      content: '',
      title: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const queryAgentResponse = async ({ agentId, message }: { agentId: string, message: string }) => {
  try {
    const response = await fetch(`${config.backend.url}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agent_id: agentId, message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Agent query error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      response: '',
    };
  }
};
