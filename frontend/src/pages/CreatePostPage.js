import React from 'react';
import PageHeader from '../components/common/PageHeader';
import PostForm from '../components/posts/PostForm';

const CreatePostPage = () => {
  return (
    <div className="container py-4">
      <PageHeader
        title="Create Educational Post"
        subtitle="Share your knowledge with the community"
      />
      
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <PostForm />
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;