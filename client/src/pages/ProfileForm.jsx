import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { INDIA_LOCATIONS } from "../data/indiaLocations";
import { emptyProfile } from "../services/userProfileService";

const COUNTRIES = ["India", "Nepal", "Sri Lanka", "Bangladesh", "Pakistan", "United Arab Emirates", "Singapore", "United Kingdom", "United States", "Canada", "Australia", "Other"];
const GENDERS = ["Female", "Male", "Transgender", "Non-binary", "Prefer not to say"];
const CASTES = ["General", "OBC", "SC", "ST", "Prefer not to say"];
const digits = (value) => value.replace(/\D/g, "");
const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function ProfileForm({ initial, submitLabel = "Enter JanSetu", onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({ ...emptyProfile(), ...initial }));
  const [errors, setErrors] = useState({});
  const isIndia = form.country === "India";
  const districts = isIndia ? (INDIA_LOCATIONS.find((state) => state.name === form.state) || {}).districts || [] : [];

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setCountry = (value) => setForm((current) => ({ ...current, country: value, state: "", city: "" }));
  const setState = (value) => setForm((current) => { const list = (INDIA_LOCATIONS.find((state) => state.name === value) || {}).districts || []; return { ...current, state: value, city: list.includes(current.city) ? current.city : "" }; });

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 3) next.name = "Enter your full name (at least 3 characters)";
    if (!form.country) next.country = "Select your country";
    if (isIndia && !form.state) next.state = "Select your state or union territory";
    if (!String(form.city).trim()) next.city = isIndia ? "Select your city / district" : "Enter your city";
    const phone = digits(form.phone);
    if (isIndia ? phone.length !== 10 : phone.length < 7 || phone.length > 15) next.phone = isIndia ? "Enter a valid 10-digit mobile number" : "Enter a valid phone number (7–15 digits)";
    if (!emailOk(form.email)) next.email = "Enter a valid email address";
    if (!form.gender) next.gender = "Select your gender";
    if (form.age && (Number(form.age) < 1 || Number(form.age) > 120)) next.age = "Enter an age between 1 and 120";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, name: form.name.trim(), city: String(form.city).trim(), occupation: form.occupation.trim(), age: form.age ? String(Number(form.age)) : "" });
  };

  const field = (key, label, required, control, full = false) => (
    <label className={`jn-account-field${full ? " full" : ""}${errors[key] ? " invalid" : ""}`} key={key}>
      <span>{label}{required ? <b>*</b> : <small>(optional)</small>}</span>
      {control}
      {errors[key] ? <em>{errors[key]}</em> : null}
    </label>
  );

  return (
    <form className="jn-account-form" onSubmit={submit} noValidate>
      {Object.keys(errors).length > 0 && (
        <div className="jn-account-alert" role="alert">
          <b>Please review your details</b>
          <span>{Object.keys(errors).length} field{Object.keys(errors).length === 1 ? "" : "s"} need your attention before you can continue.</span>
        </div>
      )}
      <div className="jn-account-grid">
        {field("name", "Full name", true, <input value={form.name} maxLength={60} autoComplete="name" placeholder="e.g. Ananya Sharma" onChange={(event) => update("name", event.target.value)} />, true)}
        {field("country", "Country", true, <select value={form.country} onChange={(event) => setCountry(event.target.value)}><option value="">Select country</option>{COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}</select>)}
        {field("gender", "Gender", true, <select value={form.gender} onChange={(event) => update("gender", event.target.value)}><option value="">Select gender</option>{GENDERS.map((gender) => <option key={gender} value={gender}>{gender}</option>)}</select>)}
        {isIndia && field("state", "State / UT", true, <select value={form.state} onChange={(event) => setState(event.target.value)}><option value="">Select state / UT</option>{INDIA_LOCATIONS.map((state) => <option key={state.name} value={state.name}>{state.name}</option>)}</select>)}
        {field("city", isIndia ? "City / District" : "City", true, isIndia
          ? <select value={form.city} disabled={!form.state} onChange={(event) => update("city", event.target.value)}><option value="">{form.state ? "Select city / district" : "Select a state first"}</option>{districts.map((district) => <option key={district} value={district}>{district}</option>)}</select>
          : <input value={form.city} maxLength={60} placeholder="Enter your city" onChange={(event) => update("city", event.target.value)} />)}
        {field("phone", "Phone number", true, <input type="tel" value={form.phone} maxLength={16} autoComplete="tel" placeholder={isIndia ? "10-digit mobile number" : "Your phone number"} onChange={(event) => update("phone", event.target.value)} />)}
        {field("email", "Email address", true, <input type="email" value={form.email} maxLength={80} autoComplete="email" placeholder="you@example.com" onChange={(event) => update("email", event.target.value)} />)}
        {field("caste", "Caste category", false, <select value={form.caste} onChange={(event) => update("caste", event.target.value)}><option value="">Select (optional)</option>{CASTES.map((caste) => <option key={caste} value={caste}>{caste}</option>)}</select>)}
        {field("age", "Age", false, <input type="number" min="1" max="120" value={form.age} placeholder="e.g. 27" onChange={(event) => update("age", event.target.value)} />)}
        {field("occupation", "Occupation", false, <input value={form.occupation} maxLength={50} placeholder="e.g. Farmer, Student, Teacher" onChange={(event) => update("occupation", event.target.value)} />, true)}
      </div>
      <div className="jn-account-actions">
        {onCancel && <button type="button" className="jn-account-cancel" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="jn-btn">{submitLabel}<ArrowRight size={16} /></button>
      </div>
    </form>
  );
}
