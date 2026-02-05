Q1:

.populate() is done using the field name, NOT the collection name.


How Mongoose resolves it internally
center: {
  type: Schema.Types.ObjectId,
  ref: "Center"
}


How Mongoose resolves it internally:
center → ObjectId → ref: "Center" → centers collection


- Moves to the "center" field,
- Then it sees its value, i.e ObjectId,
- And we also associated a particular collection name to it as 'ref' .
- And mongoose moves into that collection,
- Then populates the associative data.

_______________________________-

Q2

Golden rule

Database errors must never leak outside backend.