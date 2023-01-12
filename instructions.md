1. Create a components folder and, inside, create 2 files: Login.js and Signup.js

2. In Login.js, create a form with two inputs: email and password

3. Create a submit handler function for the form. The component should be as follows:

```js
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:8080/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(data.error);
    }

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      setIsLoading(false);
    }
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log in</h3>
      <label>email: </label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label>password: </label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button>Log in</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

4. Import Login.js in App.js to test it out. Insert the credentials for a user that already exists in your DB and open your console. Under "Application" => "Local Storage" you should see the user's email and token have been set into the local storage. (If you don't have any users in your DB yet, you can check this after we create the signup component)

5. On to the signup component. There are very little changes for this component, so you can simply copy-paste everything from Login.js and paste it in here. Make sure to change the endpoint to /signup and everything in the jsx from login to signup. If you'd like, you can import this component as well into App.js and test it.

6. Back in App.js, we can already start setting up routing. Create the routes for login and signup. The home route will come soon.

7. In the components folder, create a Home.js file. In this file we will fetch the data. (Check out the text underneath this code before testing it)

```js
import { useState, useEffect } from "react";

export default function Home({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("http://localhost:8080/posts", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setPosts(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      getData();
    }
  }, [user]);

  console.log("HERE", posts);

  return (
    <div className="posts">
      {posts.length ? (
        posts.map((post) => (
          <div key={post._id}>
            <h2>{post.title}</h2>
            <p>
              <strong>title: </strong>
              {post.title}
            </p>
            <p>
              <strong>text: </strong>
              {post.body}
            </p>
          </div>
        ))
      ) : (
        <h1 style={{ color: "red" }}>No posts found</h1>
      )}
    </div>
  );
}
```

Remember that we are protecting the endpoint and allowing access only to authenticated users. This means that we need to include the user's token in the request's headers when we send the get request.

8. Since there are a lot of changing parts in different components based on whether the user is logged in or not, let's implement the logic in App.js, so that, from there, we can let all the other components know if we have a logged in user or not.

9. In App.js, I need to have an overview on the localStorage. If there is a user saved in there, I want to create a state that holds the credentials of that user.

```js
const [user, setUser] = useState(null);

useEffect(() => {
  if (!user) {
    setUser(JSON.parse(localStorage.getItem("user")));
  }
}, [user]);
```

10. Now we can pass the setter function for the user to both the Login.js and Signup.js. Make the following adjustments:

In Login.js:

```js
import { useState } from "react";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:8080/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(data.error);
    }

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      setIsLoading(false);
      setUser(data);
    }
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log in</h3>
      <label>email: </label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label>password: </label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button>Log in</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

and for Signup.js:

```js
import { useState } from "react";

export default function Signup({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:8080/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(data.error);
    }

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      setIsLoading(false);
      setUser(data);
    }
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign up</h3>
      <label>email: </label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label>password: </label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

11. Back in App.js, import Home.js and pass it the value of user as a prop. Add it as the base route in the routing.

```js
<Home user={user} />
```

12. Back in Home.js, let's destructure the user prop and use it to grab the token for the headers. After the fetch, add a second argument like so:

```js
export default function Home({ user }) {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("http://localhost:8080/posts", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      getData();
    }
  }, [user]);

  return (
    //same code as before
  )
}
```

13. In the components folder, create a Navbar.js file. This navbar is important as it will be displaying differently based on whether the user is logged in or not

```js
import { Link } from "react-router-dom";

export default function Navbar() {
  const handleClick = () => {
    localStorage.removeItem("user");
  };

  return (
    <div className="container">
      <div className="title">
        <Link to="/">My Cool App</Link>
      </div>
      <nav>
        <button onClick={handleClick}>Log out</button>
        <div>
          <Link to="login">Login</Link>
          <Link to="signup">Signup</Link>
        </div>
      </nav>
    </div>
  );
}
```

14. Import Navbar.js in App.js and pass it both the user's value and the user's setter function as a prop. Remember to put the navbar above the routes.

```js
<Navbar user={user} setUser={setUser} />
```

Back in Navbar.js, grab the 2 props and adjust the code as follows:

```js
import { Link } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const handleClick = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="container">
      <div className="title">
        <Link to="/">My Cool App</Link>
      </div>
      <nav>
        {user !== null && (
          <div>
            <span>{user.email}</span>
            <button onClick={handleClick}>Log out</button>
          </div>
        )}
        {user === null && (
          <div>
            <Link to="login">Login</Link>
            <Link to="signup">Signup</Link>
          </div>
        )}
      </nav>
    </div>
  );
}
```

15. In App.js, import Navigate from react-router-dom. Make the following changes to the return statement:

```js
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, [user]);

  return (
    <div className="App">
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route
          path="/"
          element={user ? <Home user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup setUser={setUser} /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
```

16. On to the final phase, separating the posts so that the posts are visible only to the user that created them. To implement this, we'll have to get our hands back into the backend.

17. In the post controllers, we'll grab the user's id and pass it as an argument to the find() method to get only the posts of the user. How do we have access to the user in the request you might ask? Check out the requireAuth middleware we created. Inside the try-catch block, if the user is authorized, we create a new entity called "user" inside the request and give it the \_id as a value.
    So, in the getAllPosts function, add the following inside the try-catch block:

```js
const getAllPosts = async (req, res) => {
  try {
    const user_id = req.user._id;
    const posts = await Post.find({ user_id });
    if (!posts.length) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

18. The next step will be to add the user's id to the posts when he/she creates a post. In the same document, down in the createPots function, add the user's id to the created post:

```js
const createPost = async (req, res) => {
  const { title, body } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!body) {
    emptyFields.push("body");
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    const user_id = req.user._id;
    const post = await Post.create({ title, body, user_id });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

19. To make this work we'll have to tweek the posts schema to accept this id:

```js
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});
```

Now, when we create a new post, we will have an additional field with the id of the user that created the post. At this point, when fetching the posts, we will only get the posts created by the user that is currently logged in!

20. Mission accomplished!
