document.addEventListener('DOMContentLoaded', function() {
    // Store likes and saves in localStorage
    let likes = JSON.parse(localStorage.getItem('postLikes')) || {};
    let saves = JSON.parse(localStorage.getItem('postSaves')) || {};

    // Like Button Functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        const postId = button.dataset.postId;
        const likeCount = button.querySelector('.like-count');
        
        // Set initial state from localStorage
        if (likes[postId]) {
            button.classList.add('active');
            likeCount.textContent = likes[postId];
        }

        button.addEventListener('click', function() {
            // Prevent multiple clicks
            if (this.disabled) return;
            this.disabled = true;

            const currentLikes = parseInt(likeCount.textContent);
            const isLiked = this.classList.toggle('active');

            // Update like count with animation
            likeCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                likeCount.textContent = isLiked ? currentLikes + 1 : currentLikes - 1;
                likeCount.style.transform = 'scale(1)';
            }, 200);

            // Update localStorage
            likes[postId] = parseInt(likeCount.textContent);
            localStorage.setItem('postLikes', JSON.stringify(likes));

            // Re-enable button after animation
            setTimeout(() => {
                this.disabled = false;
            }, 500);
        });
    });

    // Save Button Functionality
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(button => {
        const postId = button.dataset.postId;
        
        // Set initial state from localStorage
        if (saves[postId]) {
            button.classList.add('active');
        }

        button.addEventListener('click', function() {
            if (this.disabled) return;
            this.disabled = true;

            const isSaved = this.classList.toggle('active');
            
            // Update localStorage
            saves[postId] = isSaved;
            localStorage.setItem('postSaves', JSON.stringify(saves));

            // Show feedback tooltip
            showTooltip(this, isSaved ? 'Post saved!' : 'Post unsaved');

            setTimeout(() => {
                this.disabled = false;
            }, 500);
        });
    });

    // Share Functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const post = this.closest('.post');
            const title = post.querySelector('h3').textContent;
            const text = post.querySelector('p').textContent;
            const url = window.location.href;

            // Different share methods based on button class
            if (this.classList.contains('facebook')) {
                const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                window.open(fbUrl, '_blank', 'width=600,height=400');
            } 
            else if (this.classList.contains('twitter')) {
                const tweet = `${title}\n${url}`;
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
                window.open(twitterUrl, '_blank', 'width=600,height=400');
            }
            else if (this.classList.contains('linkedin')) {
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                window.open(linkedinUrl, '_blank', 'width=600,height=400');
            }

            showTooltip(this, 'Sharing...');
        });
    });

    // Comments System
    const commentForms = document.querySelectorAll('.comment-form');
    commentForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const textarea = this.querySelector('textarea');
            const commentText = textarea.value.trim();
            
            if (commentText) {
                const commentsList = this.nextElementSibling;
                const newComment = createCommentElement(commentText);
                
                // Add comment with animation
                commentsList.insertBefore(newComment, commentsList.firstChild);
                
                // Clear textarea
                textarea.value = '';
                
                // Show success message
                showTooltip(this.querySelector('button'), 'Comment posted!');
            }
        });
    });
});

// Helper Functions
function createCommentElement(text) {
    const comment = document.createElement('div');
    comment.className = 'comment';
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    
    comment.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">User</span>
            <span class="comment-date">${formattedDate}</span>
        </div>
        <div class="comment-content">${text}</div>
    `;
    
    return comment;
}

function showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    
    // Position tooltip above the element
    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${rect.top - 30}px`;
    tooltip.style.left = `${rect.left + (rect.width/2)}px`;
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    
    // Animate in
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 300);
    }, 2000);
}