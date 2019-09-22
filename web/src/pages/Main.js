import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatchImage from '../assets/itsamatch.png';
import { api } from '../services/api';

export default function Main({ match }) {
    const [developers, setDevelopers] = useState([]);
    const [matchBetweenDevelopers, setMatchBetweenDevelopers] = useState(null);
    async function handleLike(id) {
        await api.post(`/developers/${id}/likes`, null, {
            headers: {
                user: match.params.id,
            },
        });
        setDevelopers(developers.filter((developer) => developer._id !== id));
    }
    async function handleDislike(id) {
        await api.post(`/developers/${id}/dislikes`, null, {
            headers: {
                user: match.params.id,
            },
        });
        setDevelopers(developers.filter((developer) => developer._id !== id));
    }

    useEffect(() => {
        (async function loadUsers() {
            const response = await api.get('/developers', {
                headers: { user: match.params.id },
            });
            setDevelopers(response.data);
        })();
    }, [match.params.id]);

    // Match event
    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id },
        });

        socket.on('match', (developer) => {
            setMatchBetweenDevelopers(developer);
        });
    }, [match.params.id]);

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>
            {developers.length > 0 ? (
                <ul>
                    {developers.map((developer) => (
                        <li key={developer._id}>
                            <img src={developer.avatar} alt="Developer" />
                            <footer>
                                <strong>{developer.name}</strong>
                                <p>{developer.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button
                                    type="button"
                                    onClick={() => handleDislike(developer._id)}
                                >
                                    <img src={dislike} alt="Dislike" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleLike(developer._id)}
                                >
                                    <img src={like} alt="Like" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty">
                    {' '}
                    You reached your developers like limit for today{' '}
                </div>
            )}
            {matchBetweenDevelopers && (
                <div className="match-container">
                    <img src={itsamatchImage} alt="It's a match" />

                    <img
                        className="avatar"
                        src={matchBetweenDevelopers.avatar}
                        alt="Developer"
                    />
                    <strong>{matchBetweenDevelopers.name}</strong>
                    <p>{matchBetweenDevelopers.bio}</p>
                    <button
                        type="button"
                        onClick={() => setMatchBetweenDevelopers(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}
