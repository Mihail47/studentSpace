import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  FormWrap,
  Icon,
  FormContent,
  Form,
  FormH1,
  FormLabel,
  FormInput,
  FormButton,
  Text,
  Shapes,
} from './SignInElements';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
    const bodyData = isSignUp
      ? { username: formData.username, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        });
        const data = await response.json();
        if (response.ok) {
          if (isSignUp) {
            setMessage('Account created successfully! Please log in.');
            setIsSignUp(false);
          } else {
            setMessage(`Welcome, ${data.user.username}!`);

            if (!data.user || !data.token) {
              setMessage('Login failed: user data is incomplete');
              return;
            }
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');

            navigate('/');
          }
        } else {
          setMessage(data.message || 'An error occurred. Please try again.');
          console.error('Login error:', data);
        }
      } catch (err) {
        console.error('Server/network error:', err);
        setMessage('Server error. Please try again later.');
      }
    };

  return (
    <Container>
      <Shapes>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </Shapes>
      <FormWrap>
        <Icon to='/'>StudySpace</Icon>
        <FormContent>
          <Form onSubmit={handleSubmit}>
            <FormH1>{isSignUp ? 'Create an account' : 'Sign in to your account'}</FormH1>
            {isSignUp && (
              <>
                <FormLabel htmlFor='username'>Username</FormLabel>
                <FormInput
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            <FormLabel htmlFor='email'>Email</FormLabel>
            <FormInput
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormLabel htmlFor='password'>Password</FormLabel>
            <FormInput
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FormButton type='submit'>{isSignUp ? 'Sign Up' : 'Sign In'}</FormButton>
            {message && <Text>{message}</Text>}
            <Text onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
            {!isSignUp && <Text>Forgot password?</Text>}
          </Form>
        </FormContent>
      </FormWrap>
    </Container>
  );
};

export default SignIn;
