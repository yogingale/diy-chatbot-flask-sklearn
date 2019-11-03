from flask import Flask
from flask import render_template, jsonify, request

from src import QueryInterpretor, ExcelSearch

title = "Documents search sample application with Flask and MongoDB"
heading = "Documents search with Flask and MongoDB"
app = Flask(__name__)
app.config["DEBUG"] = True


@app.route('/')
def hello_world():
    """
    Sample hello world
    """
    print("homepage")
    return render_template('home.html')

@app.route('/confirmation', methods=["POST"])
def feedback():
    """
    chat end point that performs NLU
    """
    print("Adding Feedback!")
    question = request.form["question"]
    answer = request.form["answer"]
    feedback_type = request.form["feedback_type"]
    ExcelSearch.update_feedback(feedback_type,question,answer)

    return jsonify({"status": "success"})

@app.route('/chat', methods=["POST"])
def chat():
    """
    chat end point that performs NLU
    """
    print("Your bot is ready to talk! Type your messages here or send 'stop'")
    while True:
        question = request.form["text"]
        if question == 'stop':
            break
        response_text = ExcelSearch.get_answer(question)

        return jsonify({"status": "success", "response": response_text})

if __name__ == "__main__":
    app.run(port=8000)