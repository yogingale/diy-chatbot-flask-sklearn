# DIY ChatBot: Flask and Sklearn
---

### QnA chatbot with a feedback mechanism.

Do you have a list of questions and answer pairs? And want to create chatbot out of it? This project will help you. Based on a user's response, we are collecting and storing the feedback in `feeback.xlsx`.

Please keep in mind that this bot will only provide the answers from given QnA pairs. Intent classification, Context generation, Entity extraction, etc is for some other day.

## Pre-requisits:
- Python 3.6+
- ```pip install -r requirements.txt```

## Usage:
- ```git clone git@github.com:yogingale/diy-chatbot-flask-sklearn.git```
- ```cd diy-chatbot-flask-sklearn```
- Add your own QnA pairs in ```QnA.csv```
- ```python app.py```
- Open http://127.0.0.1:8000/

## Chatbot in Action:

![SS](/static/bot.png)