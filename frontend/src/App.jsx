import { useState } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [docInfo, setDocInfo] = useState(null);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);


  const uploadDocument = async () => {

    if (!file) {
      setMessage("Please select a PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);


    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      setDocInfo(res.data || null);
      setMessage("✅ Document indexed successfully.");

    } catch(error){

      console.log(error);
      setMessage("❌ Upload failed.");

    }

  };



  const askQuestion = async () => {

    if (!question.trim()) return;


    const currentQuestion = question;

    setQuestion("");
    setLoading(true);


    try {


      const response = await axios.post(
        "http://127.0.0.1:8000/chat",
        {
          question: currentQuestion
        }
      );


      setMessages((prev)=>[
        ...prev,
        {
          question: currentQuestion,
          answer: response.data.answer,
          sources: response.data.sources || [],
          retrieved_chunks: response.data.retrieved_chunks || []
        }
      ]);


    }

    catch(error){

      console.log(error);
    
    
      setMessages((prev)=>[
        ...prev,
        {
          question: currentQuestion,
          answer:
            error.response?.data?.detail ||
            "❌ Something went wrong.",
          sources: [],
          retrieved_chunks: []
        }
      ]);
    
    }

    setLoading(false);

  };



return (

<div
className="
min-h-screen
relative
overflow-hidden
bg-gradient-to-br
from-slate-950
via-indigo-950
to-black
"
>


{/* Glow Background */}

<div className="
absolute
top-20
left-20
w-96
h-96
bg-cyan-500
rounded-full
blur-[160px]
opacity-40
">
</div>


<div className="
absolute
bottom-10
right-10
w-96
h-96
bg-violet-600
rounded-full
blur-[160px]
opacity-40
">
</div>



<div className="relative z-10">


{/* Header */}

<header className="text-center py-10">


<h1
className="
text-6xl
font-extrabold
bg-gradient-to-r
from-cyan-400
via-violet-500
to-pink-500
bg-clip-text
text-transparent
drop-shadow-lg
"
>
KnowledgeMind AI
</h1>


<p className="
mt-4
text-slate-400
text-lg
">
AI Powered Document Assistant using RAG + Gemini
</p>


</header>


<div className="
max-w-7xl
mx-auto
px-6
"
>


<div className="
grid
md:grid-cols-2
gap-8
"
>



{/* Upload */}

<div
className="
bg-white/10
backdrop-blur-xl
border
border-white/10
rounded-3xl
shadow-2xl
p-8
"
>


<h2 className="
text-2xl
font-semibold
mb-6
">
📄 Upload PDF
</h2>

<label
className="
block
cursor-pointer
border-2
border-dashed
border-slate-600
rounded-2xl
p-8
text-center
hover:border-violet-500
transition-all
"
>

<div className="text-5xl mb-4">
📄
</div>

<p
className="
text-xl
font-semibold
text-white
break-words
overflow-hidden
"
>
{
file
?
file.name
:
"Drag & Drop your PDF"
}
</p>


{
file && (

<p className="
text-sm
text-green-400
mt-2
">

✓ Ready to upload

</p>

)

}

{
file && (

<p className="
text-xs
text-slate-400
mt-1
">

PDF • {(file.size / 1024 / 1024).toFixed(2)} MB

</p>

)

}

<p className="
text-slate-400
mt-2
">
or click to browse
</p>


<input

type="file"

accept=".pdf"

className="hidden"

onChange={(e)=>setFile(e.target.files[0])}

/>


<p className="
text-xs
text-slate-500
mt-4
">
Supported: PDF
</p>


</label>

<button
onClick={uploadDocument}
className="
mt-6
w-full
rounded-xl
bg-gradient-to-r
from-violet-600
to-fuchsia-500
py-3
font-semibold
hover:scale-105
transition-all
duration-300
"
>
Upload Document
</button>



<p className="
mt-4
text-green-400
">
{message}
</p>

{
  docInfo && (
    <div className="mt-6 p-4 bg-black/40 rounded-xl border border-slate-700 text-sm text-slate-200">
      <p className="font-semibold mb-2">Document: {docInfo.filename}</p>
      <p>Pages: {docInfo.pages}</p>
      <p>Text extracted: {docInfo.text_length > 0 ? "✓" : "✗"}</p>
      <p>Chunks created: {docInfo.chunks}</p>
      <p>Embeddings: {docInfo.embedding_dim}-dimensional</p>
      <p>Vector index: {docInfo.index_size > 0 ? "✓" : "✗"}</p>
      <p>Status: {docInfo.status}</p>
    </div>
  )
}



</div>





{/* Ask AI */}


<div
className="
bg-white/10
backdrop-blur-xl
border
border-white/10
rounded-3xl
shadow-2xl
p-6
"
>


<h2 className="
text-2xl
font-semibold
mb-6
">
💬 Ask Anything
</h2>



<input

value={question}

onChange={(e)=>setQuestion(e.target.value)}

onKeyDown={(e)=>{
if(e.key==="Enter"){
askQuestion();
}
}}

placeholder="Ask anything about your document..."

className="
w-full
rounded-xl
bg-slate-800/70
border
border-slate-700
p-4
outline-none
mb-5
text-white
placeholder:text-slate-400
"

/>



<button

onClick={askQuestion}

disabled={loading}

className="
w-full
rounded-xl
bg-gradient-to-r
from-cyan-500
to-blue-600
py-3
font-semibold
hover:scale-105
transition-all
duration-300
disabled:opacity-50
"

>

{
loading
?
"🤖 Thinking..."
:
"Ask AI"
}


</button>



</div>



</div>





{/* Conversation */}


<div
className="
mt-10
bg-white/10
backdrop-blur-xl
border
border-white/10
rounded-3xl
shadow-2xl
p-8
"
>


<h2 className="
text-3xl
font-bold
mb-8
">
🤖 Conversation
</h2>



{
messages.length===0 &&

<p className="text-slate-400">
Upload a document and ask your first question.
</p>

}





{
messages.map((msg,index)=>(


<div
key={index}
className="mb-10"
>



{/* User */}

<div className="flex justify-end">


<div
className="
bg-gradient-to-r
from-cyan-600
to-blue-600
rounded-2xl
px-6
py-4
max-w-3xl
text-white
"
>


<p className="font-bold mb-2">
👤 You
</p>


{msg.question}


</div>


</div>





{/* AI */}


<div className="
flex
justify-start
mt-5
">


<div
className="
bg-slate-900/70
border
border-white/10
rounded-2xl
px-6
py-5
max-w-3xl
"
>


<p className="
font-bold
mb-3
text-violet-400
">
🤖 KnowledgeMind AI
</p>


<p className="
leading-8
whitespace-pre-wrap
text-white
">
{msg.answer}
</p>



{
msg.retrieved_chunks.length>0 &&


<details className="mt-6">


<summary className="
cursor-pointer
text-cyan-400
font-semibold
">

📚 Retrieved Sources

</summary>



<div className="
mt-4
space-y-3
">


{
msg.retrieved_chunks.map((chunk,i)=>(


<div

key={i}

className="
rounded-xl
bg-black/40
border
border-slate-700
p-4
text-sm
text-slate-300
leading-7
"

>

<p className="font-semibold text-white">Page {chunk.page}</p>
<p>{chunk.text}</p>

</div>


))
}



</div>


</details>


}



</div>


</div>



</div>


))
}



</div>



</div>


</div>


</div>


);

}


export default App;