import fs from "fs";

async function test() {
  const loginRes = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "vedhavsilvers@gmail.com", password: "admin123" })
  });
  const auth = await loginRes.json();

  const formData = new FormData();
  formData.append("image", new Blob(["dummy content"], { type: "image/jpeg" }), "test.jpg");

  try {
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      headers: { Authorization: "Bearer " + auth.token },
      body: formData,
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.error("FETCH ERROR", e);
  }
}
test();
