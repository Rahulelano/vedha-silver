import fs from "fs";

async function test() {
  const formData = new FormData();
  formData.append("image", new Blob(["dummy content"], { type: "application/pdf" }), "test.pdf");

  try {
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.error("FETCH ERROR", e);
  }
}
test();
