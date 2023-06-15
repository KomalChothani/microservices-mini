import React, { useState, useEffect } from "react";
import axios from 'axios'
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

export default () => {
    const [posts, setPosts] = useState({})

    // Now For getting the posts/comments we get it through query service (4002)
    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:4002/posts')
        setPosts(res.data)
    }

    // Component on mount
    useEffect(() => {
        fetchPosts()
    }, [])

    return (
        <div className="d-flex flex-row flex-wrap justify-content-between">
            {Object.values(posts).map((post) => {
                return (
                    <div className="card" style={{ width: '30%', marginBottom: '20px' }} key={post.id}>
                        <div className="card-body">
                            <h3>{post.title}</h3>

                            {/* Because now post contains the comments: [] as we now call query service */}
                            <CommentList comments={post.comments} />
                            <CommentCreate postId={post.id} />
                        </div>

                    </div>
                )
            })}
        </div>
    )
}