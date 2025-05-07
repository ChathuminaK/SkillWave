import React from 'react';
import PageHeader from '../components/common/PageHeader';
import PostForm from '../components/posts/PostForm';

const EditPostPage = () => {
  return (
    <div className="container py-4">
      <PageHeader
        title="Edit Educational Post"
        subtitle="Update your knowledge sharing"
      />
      
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <PostForm />
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;