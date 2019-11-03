import os

import pandas as pd

from . import QueryInterpretor


CONFIDENCE_THRESHOLD = 0.2


def get_answer(question: str) -> str:
    """Search for answer from QnA.csv
    """
    df = pd.read_csv('QnA.csv', None, na_filter=False)

    # Creating QnA pairs
    QnAs = list(zip(df['Question'], df['Answer']))

    if not QnAs:
        return "No Question and Answer found in the Excel."

    questions = [Q[0] for Q in QnAs]

    # Finding confidence for each quesion 
    question_index = [QueryInterpretor.cosine_sim(
        Q, question) for Q in questions]

    # Finding maximum index
    max_index = max(question_index)

    print(f'Maximum confidence: {max_index}', flush=True)

    if max_index < CONFIDENCE_THRESHOLD:
        return 'I can\'t find relatable Question in the sheet.'

    index = question_index.index(max_index)
    answer = QnAs[index]

    formatted_answer = f"Answer: {answer[1]} \n\n"
    return formatted_answer


def update_feedback(feedback_type: str, question: str, answer: str) -> None:
    """Update the feedback sheet based on positive or negative feedback
    """
    # create feedback.xlsx if not present
    if not os.path.exists(os.path.join(os.getcwd(), 'feedback.xlsx')):
        df1 = pd.DataFrame(columns=['Question', 'Answer'])
        df2 = pd.DataFrame(columns=['Question', 'Answer'])
        writer = pd.ExcelWriter('feedback.xlsx', engine='xlsxwriter')
        df1.to_excel(writer, sheet_name='positive', index=False)
        df2.to_excel(writer, sheet_name='negative', index=False)
        writer.save()

    # build dfs for positive and negative sheets
    df = pd.read_excel('feedback.xlsx', None)
    if feedback_type == "positive":
        df1 = df['positive'].append(
            {'Question': question, 'Answer': answer}, ignore_index=True)
        df2 = df['negative']
    else:
        df1 = df['positive']
        df2 = df['negative'].append(
            {'Question': question, 'Answer': answer}, ignore_index=True)

    # save the excel with both the sheets
    writer = pd.ExcelWriter('feedback.xlsx', engine='xlsxwriter')
    df1.to_excel(writer, sheet_name='positive', index=False)
    df2.to_excel(writer, sheet_name='negative', index=False)
    writer.save()
