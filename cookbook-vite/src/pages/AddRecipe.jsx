import { useEffect, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { fetchCategories } from '../features/recipes/recipeSlice';

export default function AddRecipe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.recipes);
  const user = useSelector((state) => state.user.currentUser);

  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    ingredients: [{ ingredient: '', amount: '', unit: '' }],
    portion: 1,
    nutritionalValues: [{ kcal: '', protein: '', fat: '', carbohydrates: '' }],
    directions: '',
    tags: '',
    href: '',
    time: '',
    categories: [],
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleIngredientChange = (i, field, value) => {
    const updated = [...form.ingredients];
    updated[i][field] = value;
    setForm((prev) => ({ ...prev, ingredients: updated }));
  };

  const addIngredient = () => {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredient: '', amount: '', unit: '' }],
    }));
  };

  const removeIngredient = (index) => {
    const updated = [...form.ingredients];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, ingredients: updated }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((prev) => ({ ...prev, categories: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      ingredients: form.ingredients.map((ing) => ({
        ingredient: ing.ingredient.trim(),
        amount: Number(ing.amount),
        unit: ing.unit.trim()
      })),
      portion: Number(form.portion),
      nutritionalValues: [
        {
          kcal: form.nutritionalValues[0].kcal.trim(),
          protein: form.nutritionalValues[0].protein.trim(),
          fat: form.nutritionalValues[0].fat.trim(),
          carbohydrates: form.nutritionalValues[0].carbohydrates.trim(),
        },
      ],
      directions: form.directions.trim(),
      tags: form.tags.split(/[,\s]+/).map((t) => t.toLowerCase()).filter(Boolean),
      href: form.href.trim(),
      time: Number(form.time),
      comments: [],
      rating: [],
      categories: form.categories,
    };

    try {
      const res = await axios.post('/cookbook/recipe', payload, { withCredentials: true });
      if (res.status === 201) {
        setMessage('Recipe added successfully!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage('Submission failed.');
      }
    } catch (err) {
      console.error('Submission failed:', err.response?.data || err.message);
      setMessage('Submission failed: ' + (err.response?.data || 'Unknown error'));
    }
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <h2>Add Recipe</h2>
        <p>You need to log in to add a recipe.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <h2 className="text-center mb-4">Add New Recipe</h2>
          <form onSubmit={handleSubmit} className="border rounded p-4 bg-light shadow-sm">
            <div className="mb-3">
              <label className="form-label">Recipe Name</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <h5>Ingredients</h5>
              {form.ingredients.map((ing, i) => (
                <div key={i} className="row g-2 mb-2 align-items-center">
                  <div className="col-auto">
                    {form.ingredients.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeIngredient(i)}
                      >
                        &minus;
                      </button>
                    )}
                  </div>
                  <div className="col-md-4">
                    <input
                      className="form-control"
                      placeholder="Ingredient"
                      value={ing.ingredient}
                      onChange={(e) => handleIngredientChange(i, 'ingredient', e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      className="form-control"
                      placeholder="Amount"
                      type="number"
                      value={ing.amount}
                      onChange={(e) => handleIngredientChange(i, 'amount', e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      className="form-control"
                      placeholder="Unit"
                      value={ing.unit}
                      onChange={(e) => handleIngredientChange(i, 'unit', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addIngredient} className="btn btn-outline-secondary btn-sm mt-2">
                + Add Ingredient
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label">Portion Size</label>
              <input
                className="form-control"
                name="portion"
                type="number"
                value={form.portion}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <h5>Nutritional Values</h5>
              <div className="row g-2">
                {['kcal', 'protein', 'fat', 'carbohydrates'].map((key) => (
                  <div key={key} className="col-sm-6 col-md-3">
                    <input
                      className="form-control"
                      placeholder={key}
                      type="number"
                      value={form.nutritionalValues[0][key]}
                      onChange={(e) => {
                        const updated = { ...form.nutritionalValues[0], [key]: e.target.value };
                        setForm((prev) => ({ ...prev, nutritionalValues: [updated] }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Directions</label>
              <textarea
                className="form-control"
                name="directions"
                rows="4"
                value={form.directions}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tags <small className="text-muted">(comma-separated)</small></label>
              <input
                className="form-control"
                name="tags"
                value={form.tags}
                onChange={handleInputChange}
                placeholder="e.g. spicy, vegan, quick"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input
                className="form-control"
                name="href"
                value={form.href}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Time (minutes)</label>
              <input
                className="form-control"
                name="time"
                type="number"
                value={form.time}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Categories</label>
              <select
                className="form-select"
                multiple
                onChange={handleCategoryChange}
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <button className="btn btn-success px-4" type="submit">
                Add Recipe
              </button>
              {message && <span className="text-muted ms-3">{message}</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
