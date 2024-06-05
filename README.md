## Inspiration

One of our used apps was the voice memo app on the iPhone. We have used it very often for things like keeping track of conversations, taking notes in class, etc. However, one of the biggest limitations with voice memos is the necessity of having to back in and replay the voice memo and having to look for a very specific moment to find something you are looking for. From this experience, we realized the potential that LLMs could play with streamlining and making this process significantly less tedious therefore saving tons of time in the process.

## What it does

Our app is meant to listen in on your conversations and take out key details and actionable items from them - it helps you be on time and acts as a little personal assistant. Amica can take any audio recording map out key to-dos for you and add important events to a calendar. Users can also use the chat feature to 

## How we built it

We built this project using OpenAI APIs - GPT-4-turbo and Whisper. All user recordings are passed through the whisper API which lets us transcribe them, these are then stored in a vector database with the help of OpenAI. This information is then used to create actionable items with the help of GPT 4 and is also used by our agent to answer any questions the user might have. 

## Challenges we ran into

The most difficult part of this project was covering all of the edge cases with LLMs. LLMs tend to be extremely stochastic entities and oftentimes will output things you would not expect. For example, one of the things we were trying to keep track of was time. In one of our example prompts, we said “tonight” instead of an actual time and the LLM interpreted it as an actual time. Despite technically being correct, this was not the expected output, and therefore, we needed to alter the prompt to take this into account.

## Accomplishments that we're proud of

We’re proud of having built a useful agent in a short duration. This project can be used for experimenting with different agent interaction UIs - it serves as a good MVP for how general purpose assistants can be used in the future.

## What's next for Amica

Our app is meant for single users to plan out their days (i.e., it's a supercharged voice memo app). In the future, we hope to provide our consumers with collaborative functionality to enable AI agents to make plans based on a more conversational context. There are a couple of ways this could work - first, if both users have the app, we could process the transcribed voice memos separately so that the AI agent can differentiate between the two people in the conversation, aggregate it later as a post-processing step, and from that it could make plans. Alternatively, on a singular device, we could apply speech diarization techniques to differentiate between multiple people talking. 

Another feature we want to potentially pursue is making this agent become a single source of truth for all your data. Right now, we only leverage voice memos for information. We could give it additional permissions to look at things like screenshots (i.e., perhaps plane tickets) and organize all that information into a more actionable set of items. Essentially, the larger idea is this should be the unified hub for all organizational purposes, completely automated and controlled by AI.
