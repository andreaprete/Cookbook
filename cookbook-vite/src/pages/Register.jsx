import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/user/userSlice';

export default function Register() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    street: '',
    postcode: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3030/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        dispatch(setUser({ email: formData.email }));
        setMessage('Registered and logged in!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        const errText = await res.text();
        setMessage(`${errText}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit}>
                {[
                  ['firstname', 'First Name'],
                  ['lastname', 'Last Name'],
                  ['street', 'Street'],
                  ['postcode', 'Postcode'],
                  ['city', 'City'],
                  ['country', 'Country'],
                  ['phone', 'Phone'],
                  ['email', 'Email'],
                  ['password', 'Password'],
                ].map(([name, label]) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label">{label}</label>
                    <input
                      type={name === 'password' ? 'password' : name === 'email' ? 'email' : 'text'}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                ))}
                <div className="d-grid mt-3">
                  <button type="submit" className="btn btn-success">
                    Register
                  </button>
                </div>
                {message && (
                  <div className="mt-3 text-center text-muted">
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
