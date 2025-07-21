import React, { useState } from 'react';
import Layout from '../../components/Layout';

export default function EditProfilePage() {
  const [form, setForm] = useState({ fullname: '', contact: '', location: '', profilepic: null });
  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };
  const handleSubmit = e => { e.preventDefault(); /* Implement update logic */ };
  return (
    <Layout>
      <main className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">✏️ Edit Your Profile</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label>Full Name</label>
            <input type="text" name="fullname" value={form.fullname} onChange={handleChange} required className="input" />
          </div>
          <div className="mb-4">
            <label>Contact</label>
            <input type="text" name="contact" value={form.contact} onChange={handleChange} required className="input" />
          </div>
          <div className="mb-4">
            <label>Location</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} className="input" />
          </div>
          <div className="mb-4">
            <label>Change Profile Picture</label><br />
            <input type="file" name="profilepic" accept="image/*" onChange={handleChange} />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
        </form>
      </main>
    </Layout>
  );
} 