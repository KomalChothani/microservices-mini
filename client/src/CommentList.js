import React from "react";

export default ({ comments }) => {
    return (
        <div>
            <ul>
                {comments.map((comment) => <li key={comment.id}>{comment.content}</li>)}
            </ul>
        </div>
    )
}
