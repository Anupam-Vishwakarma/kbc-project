from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify specific domains like ['http://localhost:3000']
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "Welcome to KBC Backend!"}

# Questions and answers data
questions_data = [
    {
        "question": "What is the capital of India?",
        "options": ["Delhi", "Mumbai", "Kolkata", "Chennai"],
        "correct_answer": "Delhi",
        "prize": 1000
    },
    {
        "question": "Who developed the theory of relativity?",
        "options": ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
        "correct_answer": "Albert Einstein",
        "prize": 2000
    },
    {
        "question": "Which planet is known as the Red Planet?",
        "options": ["Earth", "Mars", "Jupiter", "Saturn"],
        "correct_answer": "Mars",
        "prize": 5000
    },
    {
        "question": "Who wrote the novel '1984'?",
        "options": ["George Orwell", "Aldous Huxley", "Ray Bradbury", "J.K. Rowling"],
        "correct_answer": "George Orwell",
        "prize": 10000
    },
    {
        "question": "In which year did India gain independence?",
        "options": ["1942", "1947", "1950", "1960"],
        "correct_answer": "1947",
        "prize": 20000
    },
    {
        "question": "What is the chemical symbol for water?",
        "options": ["H2O", "CO2", "O2", "H2SO4"],
        "correct_answer": "H2O",
        "prize": 40000
    },
    {
        "question": "What is the largest mammal on Earth?",
        "options": ["Elephant", "Whale", "Giraffe", "Shark"],
        "correct_answer": "Whale",
        "prize": 80000
    },
    {
        "question": "Who painted the Mona Lisa?",
        "options": ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        "correct_answer": "Leonardo da Vinci",
        "prize": 160000
    },
    {
        "question": "Which element has the chemical symbol 'O'?",
        "options": ["Oxygen", "Osmium", "Ozone", "Oganesson"],
        "correct_answer": "Oxygen",
        "prize": 320000
    },
    {
        "question": "Who was the first man to walk on the moon?",
        "options": ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn"],
        "correct_answer": "Neil Armstrong",
        "prize": 640000
    },
    {
        "question": "What is the longest river in the world?",
        "options": ["Amazon", "Nile", "Ganges", "Yangtze"],
        "correct_answer": "Nile",
        "prize": 1250000
    },
    {
        "question": "Which country is known as the Land of the Rising Sun?",
        "options": ["China", "South Korea", "Japan", "India"],
        "correct_answer": "Japan",
        "prize": 2500000
    },
    {
        "question": "What is the tallest mountain in the world?",
        "options": ["K2", "Kangchenjunga", "Mount Everest", "Makalu"],
        "correct_answer": "Mount Everest",
        "prize": 5000000
    },
    {
        "question": "Who invented the telephone?",
        "options": ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Albert Einstein"],
        "correct_answer": "Alexander Graham Bell",
        "prize": 10000000
    },
    {
        "question": "Which is the largest country by area?",
        "options": ["USA", "China", "Canada", "Russia"],
        "correct_answer": "Russia",
        "prize": 20000000
    },
    {
        "question": "What is the square root of 144?",
        "options": ["10", "12", "14", "16"],
        "correct_answer": "12",
        "prize": 40000000
    }
]

# Sample API to fetch questions based on the number
@app.get("/question/{question_number}")
def get_question(question_number: int):
    try:
        # Retrieve question from the list based on the index (question_number)
        question = questions_data[question_number - 1]
        return {"question": question}
    except IndexError:
        return {"message": "Question not found"}
