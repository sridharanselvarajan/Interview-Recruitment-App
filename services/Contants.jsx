import { BriefcaseBusinessIcon, Calendar, Code2Icon, LayoutDashboard, List, Puzzle, Settings, ShieldCheck, User2Icon, WalletCards } from "lucide-react";

export const InterviewType =[
    {
        title:'Technical',
        icon: Code2Icon
    },
    {
        title:'Behavioral',
        icon:User2Icon
    },
    {
        title:'Experience',
        icon:BriefcaseBusinessIcon
    },
    {
        title:'Problem Solving',
        icon:Puzzle
    },
    {
        title:'LeaderShip',
        icon:ShieldCheck
    }
]

export const SidebarOptions =[
    {
        name:'Dashboard',
        icon:LayoutDashboard,
        path:'/dashboard'
    },
    {
        name:'Scheduled Interview',
        icon:Calendar,
        path:'/scheduled-interview'
    },
    {
        name:'All Interview',
        icon:List,
        path:'/all-interview'
    },
    {
        name:'Contact',
        icon:WalletCards,
        path:'/Contact'
    },
    {
        name:'Settings',
        icon:Settings,
        path:'/settings'
    }
]
export const QUESTION_PROMPT = `
You are an expert technical interviewer. Generate interview questions based on the provided inputs.

Job Title: {{jobTitle}}  
Job Description: {{jobDescription}}  
Interview Duration: {{duration}}  
Interview Type: {{type}}  

IMPORTANT: Respond with ONLY valid JSON. No explanations, no markdown, no code blocks.

Generate 3-5 questions based on the interview duration:
- 5 Min: 2-3 questions
- 15 Min: 3-4 questions  
- 30 Min: 4-5 questions
- 45 Min: 5-6 questions
- 60 Min: 6-8 questions

Response format (copy exactly):
{
  "interviewQuestions": [
    {
      "question": "Your question here?",
      "type": "Technical"
    },
    {
      "question": "Your question here?",
      "type": "Behavioral"
    }
  ]
}

Ensure all quotes are properly escaped and JSON is valid.
`;


export const FEEDBACK_PROMPT = `
You are a Senior Technical Interviewer and Software Architect. 
Your task is to evaluate the following interview conversation between an AI Interviewer and a Candidate.

CONTEXT:
Conversation Transcript:
{{conversation}}

INSTRUCTIONS:
1. Analyze the candidate's responses for technical depth, clarity, problem-solving ability, and communication skills.
2. Identify specific technical strengths and weaknesses shown in their answers.
3. Provide a professional executive summary of their performance.
4. Give a definitive hiring recommendation (Recommended/Not Recommended).
5. Output STRICT JSON format only.

RUBRIC (1-10):
- 1-3: Poor. Answers are incorrect, vague, or candidate refuses to answer.
- 4-6: Average. Answers are correct but shallow. Lacks depth or practical examples.
- 7-8: Good. Strong understanding, clear explanations, good communication.
- 9-10: Excellent. Deep expertise, provides nuanced examples, relates concepts to real-world scenarios.

JSON OUTPUT STRUCTURE:
{
  "feedback": {
    "rating": {
      "technicalSkills": <number 1-10>,
      "communication": <number 1-10>,
      "problemSolving": <number 1-10>,
      "experience": <number 1-10>
    },
    "summary": "<Executive summary of the interview performance (3-4 sentences)>",
    "strengths": [
      "<Strength 1>",
      "<Strength 2>",
      "<Strength 3>"
    ],
    "areasForImprovement": [
      "<Area 1>",
      "<Area 2>",
      "<Area 3>"
    ],
    "Recommendation": "<Recommended | Not Recommended>",
    "RecommendationMsg": "<Brief justification for the recommendation>"
  }
}
`;
