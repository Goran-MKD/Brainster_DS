import os
from openai import OpenAI
from dotenv import load_dotenv

def generate_product_description(product_name: str, features: list[str]) -> str:
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not found in environment variables.")

    client = OpenAI(api_key=api_key)
    """
    Generates a product description using OpenAI's chat completion.
    """
    prompt = (
        f"You are an expert e-commerce copywriter. "
        f"Write a compelling, engaging, and SEO-friendly product description for a product named '{product_name}'.\n"
        f"The key features are: {', '.join(features)}.\n"
        f"Highlight the benefits of these features to the target customer. Use a friendly and persuasive tone."
        f"The description should be approximately 3-4 sentences long."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Using a cost-effective model for this example
            messages=[
                {"role": "system", "content": "You are an expert e-commerce copywriter."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        description = response.choices[0].message.content.strip()
        return description
    except Exception as e:
        # In a real app, you'd want more robust error handling and logging
        print(f"An error occurred: {e}")
        return "Error: Could not generate product description."
