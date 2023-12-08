# 0x00-learn_node

create an expense app. said app tracks income and expenses

saves income and expenses reports in a db

## endpoints

### income
* `GET /report/income` -> fetch all income reports
* `GET /report/income/:id` -> fetch an income report by id
* `POST /report/income` -> create an income report
* `PUT /report/income/:id` -> update an income report by id
* `DELETE /report/income/:id` -> delete an income report by id

### expenses
* `GET /report/expenses` -> fetch all iexpensesreports
* `GET /report/expenses/:id` -> fetch an expenses report by id
* `POST /report/expenses` -> create an expenses report
* `PUT /report/expenses/:id` -> update an expenses report by id
* `DELETE /report/expenses/:id` -> delete an expenses report by id
