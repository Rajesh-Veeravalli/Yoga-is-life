from logging import currentframe
from typing import final
from flask import Flask, render_template, request
import json
import sqlite3
import datetime

db_file = "db.sqlite3"

def create_connection():
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "GET":
        return (render_template('form.html'))
    try:
        print()
        form = json.loads(request.data)
        print(form)
        
        firstName = form["firstName"]
        lastName = form["lastName"]
        age = form["age"]
        batch = form["batch"]
        phone = form["phone"]
        print(form)
        paid = 1 if form["paidStatus"] else 0
        date = str(datetime.datetime.now())[:10]
        query = f'insert into registration(firstname, lastname, age, batch, phone, paid, date) values ("{firstName}", "{lastName}", {age}, {batch}, "{phone}", {paid}, "{date}");'
        print("sql query:", query)
        db = create_connection()
        cursor = db.cursor()
        cursor.execute(query)
        db.commit()

        return "success"
    except Exception as exp:
        # return("", 403)
        return ("failure", 403)



@app.route("/users")
def registered_users():
    try:
        user_data = []
        db = create_connection()
        cursor = db.cursor()
        cursor.execute("select * from registration order by id desc;")
        rows = cursor.fetchall()
        for id, name, last, age, batch, phone, paidStatus, registeredDate in rows:
            user_data.append({"id": id, "firstName":name, "lastName": last, "age": age, "batch": batch, "phone": phone, "paidStatus": paidStatus, "registeredDate": registeredDate})
    except Exception as exp:
        print(exp)
    finally:
        return json.dumps(user_data)
            
@app.route("/pay", methods=["POST"])
def delayed_payment():
    try:
        id = json.loads(request.data)
        db = create_connection()
        cursor = db.cursor()
        query = f"update registration set paid=1 where id={id};"
        cursor.execute(query)
        db.commit()
        
    except Exception as exp:
        print(exp)
    finally:
        return "invalid request"
        
        


if __name__=="__main__":
    app.run(debug=True)
