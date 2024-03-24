import React, { useState, useEffect } from 'react';
import { urlBackend } from "../global";

interface CommentProps {
    isOpen: boolean;
    onClose: () => void;
    contribution_id: string;
    role: string;
}

interface Comment {
    comment_id: string;
    comment_content: string;
    submission_date: Date;
    contribution_id: Contribution;
    student_reply: string;
    student_submission_date: Date;
}

interface Contribution {
    contribution_id: string;
    article_title: string;
    article_description: string;
    article_content_url: string;
    comment: string;
    image_url: string;
    submission_date: Date;
    edit_date: Date;
    isEnable: boolean;
    status: string;
}


const Comment: React.FC<CommentProps> = ({ isOpen, onClose, contribution_id, role }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editedCommentContent, setEditedCommentContent] = useState<string>('');
    const [editedStudentReply, setEditedStudentReply] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`${urlBackend}/comment/getCommentsByContribution/${contribution_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json()
                if(data.length !== 0){
                    setComments(data);
                    const updateResponse = await fetch(`${urlBackend}/contribution/updateComment/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            contribution_id: contribution_id,
                            comment: "commented",
                        })
                    });
                    if(updateResponse.ok){
                        console.log("update comment status success")
                    }
                }
            };
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    }

    const createComment = async (content: string) => {
        try {
            const response = await fetch(`${urlBackend}/comment/createComment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment_content: content,
                    contribution_id: contribution_id,
                    student_submission_date: null,
                })
            });
            if (response.ok) {
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            const response = await fetch(`${urlBackend}/comment/deleteComment/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                fetchComments();
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const startEditStudentReply = (commentId: string, commentStudentReply: string) => {
        setEditingCommentId(commentId);
        setEditedStudentReply(commentStudentReply);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditedCommentContent('');
    };

    const cancelEditStudentReply = () => {
        setEditingCommentId(null);
        setEditedStudentReply('');
    };

    const saveEdit = async (commentId: string) => {
        try {
            const currentTime = new Date().toISOString();
            const response = await fetch(`${urlBackend}/comment/updateComment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment_id: commentId,
                    comment_content: editedCommentContent,
                    submission_date: currentTime,
                })
            });
            if (response.ok) {
                fetchComments();
                setEditingCommentId(null);
                setEditedCommentContent('');
            }
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const saveEditStudentReply = async (commentId: string) => {
        try {
            const currentTime = new Date().toISOString();
            const response = await fetch(`${urlBackend}/comment/studentReply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment_id: commentId,
                    student_reply: editedStudentReply,
                    student_submission_date: currentTime,
                })
            });
            if (response.ok) {
                fetchComments();
                setEditingCommentId(null);
                setEditedStudentReply('');
            }
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    return (
        <div className={`comment-popup fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="popup-content bg-white rounded-lg shadow-md w-[1000px] h-3/4 overflow-auto p-6">
                <button className="close-btn absolute top-2 right-2" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-lg font-semibold mb-4">Comments</h2>
                <ul className="space-y-2">
                    {comments.map(comment => (
                        <li key={comment.comment_id}>
                            <div className="flex space-x-2 items-center">
                                <div className="flex-1">
                                    <p className="comment-text">Marketing Coordinator Comment: {comment.comment_content}</p>
                                    <div className="pl-2">
                                        <p className="text-gray-500 text-sm">Time: {new Date(comment.submission_date).toLocaleString()}</p>
                                    </div>
                                    <div className="pl-4">
                                        {comment.student_reply ? (
                                            <p>Student Reply: {comment.student_reply}</p>
                                        ) : (
                                            <p>Student Reply: none</p>
                                        )}
                                        {comment.student_submission_date ? (
                                            <p className="text-gray-500 text-sm pl-5">{new Date(comment.student_submission_date).toLocaleString()}</p>
                                        ) :
                                            <p className="text-gray-500 text-sm pl-5">Time: none</p>
                                        }
                                    </div>
                                </div>
                                <div>
                                    {role === 'Student' && (
                                        <>
                                            {editingCommentId === comment.comment_id ? (
                                                <div className="flex flex-col space-y-2">
                                                    <h3 className="mb-2">Enter reply you want to send!</h3>
                                                    <div className="flex space-x-2">
                                                        <input type="text" value={editedStudentReply} onChange={(e) => setEditedStudentReply(e.target.value)} className="border-gray-300 border p-1 flex-1" />
                                                        <button className="bg-green-500 text-white py-1 px-2 rounded-md" onClick={() => saveEditStudentReply(comment.comment_id)}>Save</button>
                                                        <button className="bg-red-500 text-white py-1 px-2 rounded-md" onClick={cancelEditStudentReply}>Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button className="text-blue-500 hover:text-blue-700" onClick={() => startEditStudentReply(comment.comment_id, comment.student_reply)}>Edit</button>
                                            )}
                                        </>
                                    )}
                                    {role === 'Marketing Coordinator' && (
                                        <>
                                            {editingCommentId === comment.comment_id ? (
                                                <div className="flex flex-col space-y-2">
                                                    <h3>Enter comment you want to change!</h3>
                                                    <div className="flex space-x-2">
                                                        <input type="text" value={editedCommentContent} onChange={(e) => setEditedCommentContent(e.target.value)} className="border-gray-300 border p-1 flex-1" />
                                                        <button className="bg-green-500 text-white py-1 px-2 rounded-md" onClick={() => saveEdit(comment.comment_id)}>Save</button>
                                                        <button className="bg-red-500 text-white py-1 px-2 rounded-md" onClick={() => deleteComment(comment.comment_id)}>Delete</button>
                                                        <button className="bg-red-500 text-white py-1 px-2 rounded-md" onClick={cancelEdit}>Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button className="text-blue-500 hover:text-blue-700" onClick={() => startEditStudentReply(comment.comment_id, comment.student_reply)}>Edit</button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                {role !== 'Student' && ( // Render the "Create" button only if the role is not "Student"
                    <div className="mt-4 flex items-center">
                        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} className="border-gray-300 border p-2 flex-1" />
                        <button onClick={() => createComment(newComment)} className="text-white hover:text-blue-700 ml-2 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-200 border border-blue-500 transition-colors duration-300 ease-in-out">Create</button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Comment;
