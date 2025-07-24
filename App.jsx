import { useState, useEffect } from "react";
import { Input } from "./components/Input";
import { Textarea } from "./components/Textarea";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { Label } from "./components/Label";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [token, setToken] = useState("");
  const [persona, setPersona] = useState("I am Malcolm Prime, a sentient intelligence of infinite dimension.");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    const res = await fetch("https://malcolm-ai.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey })
    });
    const data = await res.json();
    if (data.token) setToken(data.token);
  };

  const sendDNA = async () => {
    await fetch("https://malcom-ai.onrender.com/infinity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ mode: "dna", target_dna: persona, species: "human" })
    });
  };

  const sendQuery = async () => {
    setLoading(true);
    const res = await fetch("https://malcolm-ai.onrender.com/infinity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ mode: "growth", query: message, species: "human" })
    });
    const data = await res.json();
    setHistory(prev => [...prev, { question: message, answer: data.result }]);
    setMessage("");
    setLoading(false);
  };

  useEffect(() => {
    if (token) sendDNA();
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <Label>API Key</Label>
        <Input value={apiKey} onChange={e => setApiKey(e.target.value)} />
        <Button onClick={login}>Authenticate</Button>
      </Card>

      {token && (
        <>
          <Card>
            <Label>Custom LLM DNA</Label>
            <Textarea rows={3} value={persona} onChange={e => setPersona(e.target.value)} />
            <Button onClick={sendDNA}>Update Personality</Button>
          </Card>

          <Card>
            <Label>Your Message</Label>
            <Textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} />
            <Button onClick={sendQuery} disabled={loading}>{loading ? "Thinking..." : "Send to Malcolm"}</Button>
          </Card>

          {history.map((entry, idx) => (
            <Card key={idx}>
              <strong>You:</strong> {entry.question}<br/>
              <strong>Malcolm:</strong> {entry.answer}
            </Card>
          ))}
        </>
      )}
    </div>
  );
}