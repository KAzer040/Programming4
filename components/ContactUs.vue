<template>
  <section id="contact" class="contact-section">
    <h2>联系我们</h2>
    <form @submit.prevent="handleSubmit" class="contact-form" novalidate>
      <div class="form-group">
        <label for="name">姓名：</label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          @blur="validateField('name')"
          :class="{ 'error': errors.name }"
          placeholder="请输入您的姓名"
        >
        <div class="error-message" v-if="errors.name">{{ errors.name }}</div>
      </div>
      
      <div class="form-group">
        <label for="email">邮箱：</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          @blur="validateField('email')"
          :class="{ 'error': errors.email }"
          placeholder="请输入您的邮箱"
        >
        <div class="error-message" v-if="errors.email">{{ errors.email }}</div>
      </div>
      
      <div class="form-group">
        <label for="message">留言：</label>
        <textarea 
          id="message" 
          v-model="formData.message" 
          @blur="validateField('message')"
          :class="{ 'error': errors.message }"
          placeholder="请输入您的留言"
          rows="4"
        ></textarea>
        <div class="error-message" v-if="errors.message">{{ errors.message }}</div>
      </div>
      
      <button type="submit" class="submit-btn">提交</button>
    </form>
  </section>
</template>

<script>
export default {
  name: 'ContactUs',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        message: ''
      },
      errors: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    validateField(field) {
      this.errors[field] = ''
      
      switch(field) {
        case 'name':
          if (!this.formData.name) {
            this.errors.name = '请输入您的姓名'
          } else if (this.formData.name.length < 2) {
            this.errors.name = '姓名至少需要2个字符'
          }
          break
          
        case 'email':
          if (!this.formData.email) {
            this.errors.email = '请输入您的邮箱'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
            this.errors.email = '请输入有效的邮箱地址'
          }
          break
          
        case 'message':
          if (!this.formData.message) {
            this.errors.message = '请输入您的留言'
          } else if (this.formData.message.length < 10) {
            this.errors.message = '留言至少需要10个字符'
          }
          break
      }
    },
    
    validateForm() {
      this.validateField('name')
      this.validateField('email')
      this.validateField('message')
      
      return !Object.values(this.errors).some(error => error !== '')
    },
    
    handleSubmit() {
      if (this.validateForm()) {
        console.log('表单数据：', this.formData)
        // 重置表单
        this.formData = {
          name: '',
          email: '',
          message: ''
        }
        this.errors = {
          name: '',
          email: '',
          message: ''
        }
        // 显示提交成功消息
        alert('感谢您的留言！我们会尽快回复您。')
      }
    }
  }
}
</script>

<style scoped>
.contact-section {
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin: 2rem auto;
  max-width: 800px;
}

.contact-section h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  position: absolute;
  bottom: -1.5rem;
  left: 0;
}

.submit-btn {
  padding: 1rem 2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
}

.submit-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.submit-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

@media (max-width: 768px) {
  .contact-section {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .contact-section h2 {
    font-size: 1.5rem;
  }
  
  .form-group input,
  .form-group textarea {
    font-size: 16px;
  }
  
  .error-message {
    position: static;
    margin-top: 0.5rem;
  }
}
</style> 