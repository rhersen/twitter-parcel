@bs.val external document: 'a = "document"

let set = s => document["getElementById"]("status")["innerHTML"] = s
