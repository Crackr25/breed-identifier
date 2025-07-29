import { PetResult } from '@/app/page'

// OpenRouter.ai API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

// Interface for OpenRouter API response
interface OpenRouterResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

// Interface for parsed AI response
interface AIPetIdentification {
  animal: 'cat' | 'dog' | 'unknown'
  breed: string
  confidence: number
  description: string
}

// Convert image buffer to base64 for API transmission
function bufferToBase64(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`
}

// Parse AI response to extract structured data
function parseAIResponse(content: string): AIPetIdentification {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(content)
    return {
      animal: parsed.animal || 'unknown',
      breed: parsed.breed || 'Unknown',
      confidence: parsed.confidence || 0.5,
      description: parsed.description || 'No description available'
    }
  } catch {
    // If JSON parsing fails, extract information using regex patterns
    const animalMatch = content.match(/animal[:\s]+(cat|dog|unknown)/i)
    const breedMatch = content.match(/breed[:\s]+([^\n,]+)/i)
    const confidenceMatch = content.match(/confidence[:\s]+(\d+(?:\.\d+)?)/i)
    const descriptionMatch = content.match(/description[:\s]+([^\n]+)/i)
    
    return {
      animal: (animalMatch?.[1]?.toLowerCase() as 'cat' | 'dog' | 'unknown') || 'unknown',
      breed: breedMatch?.[1]?.trim() || 'Unknown Breed',
      confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.7,
      description: descriptionMatch?.[1]?.trim() || 'Pet breed identified from image analysis.'
    }
  }
}

// Call OpenRouter.ai API for pet breed identification
async function callOpenRouterAPI(imageBase64: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable.')
  }

  const prompt = `You are an expert veterinarian and animal breed specialist. Analyze this image and determine if it shows a cat or dog, then identify the breed. Provide your analysis in the following JSON format:

{
  "animal": "cat" | "dog" | "unknown",
  "breed": "exact breed name",
  "confidence": 0.0-1.0,
  "description": "detailed description including breed characteristics, temperament, and key identifying features"
}

Be as accurate as possible. If the image does not clearly show a cat or dog, set animal to "unknown" and explain what you see instead. If you're not certain about the exact breed, provide the most likely identification and adjust confidence accordingly. Focus on:
1. Facial features and structure
2. Body size and proportions
3. Coat pattern, color, and texture
4. Ear shape and position
5. Any distinctive breed characteristics

IMPORTANT: Respond ONLY with the JSON object, no additional text.`

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Snake Species Identifier'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet', // Using Claude 3.5 Sonnet for best vision capabilities
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.3 // Lower temperature for more consistent, factual responses
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
  }

  const data: OpenRouterResponse = await response.json()
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from OpenRouter API')
  }

  return data.choices[0].message.content
}

export async function identifyPet(imageBuffer: Buffer, mimeType: string): Promise<PetResult> {
  try {
    // Convert image to base64
    const imageBase64 = bufferToBase64(imageBuffer, mimeType)
    
    // Call OpenRouter.ai API
    const aiResponse = await callOpenRouterAPI(imageBase64)
    
    // Parse the AI response
    const identification = parseAIResponse(aiResponse)
    
    return {
      animal: identification.animal,
      breed: identification.breed,
      confidence: identification.confidence,
      description: identification.description
    }
  } catch (error) {
    console.error('Error in pet identification:', error)
    
    // Provide a more specific error message
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenRouter API key not configured. Please check your environment variables.')
      } else if (error.message.includes('OpenRouter API error')) {
        throw new Error('Failed to connect to OpenRouter API. Please try again later.')
      }
    }
    
    throw new Error('Failed to identify pet breed. Please try again.')
  }
}
