import { defineSecret } from "firebase-functions/params";
import Anthropic from "@anthropic-ai/sdk";

export const anthropicApiKey = defineSecret("ANTHROPIC_API_KEY");

let client: Anthropic | undefined;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: anthropicApiKey.value() });
  }
  return client;
}
