import React, { useState } from 'react';

function UserPostsSection() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <button onClick={toggleCollapse}>
        {isCollapsed ? 'Expand' : 'Collapse'} User Posts
      </button>

      {!isCollapsed && (
        <div>
          {/* Your user posts content goes here */}
          <p>User Post 1</p>
          <p>User Post 2</p>
          <p>User Post 3</p>
        </div>
      )}
    </div>
  );
}

export default UserPostsSection;
