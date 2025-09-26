/* src/components/SubmitRestaurant.jsx */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';
import api from '../api'; // ✅ 네 axios 인스턴스 (baseURL=VITE_API_BASE_URL)

const FormContainer = styled.div`
  /* ... 기존 스타일 그대로 */
`;

// ⚠️ SuccessMessage, Input 등 기존 styled 컴포넌트는 그대로 두면 됨

function SubmitRestaurant() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      // ✅ Render API로 직접 전송
      const response = await api.post('/api/restaurants', {
        name: data.restaurantName,
        category: data.category,
        location: data.location,
        priceRange: data.priceRange || '정보 없음',
        description: data.review || '',
        recommendedMenu: data.recommendedMenu?.split(',').map((i) => i.trim()),
      });

      if (response.status === 201) {
        setSubmitted(true);
        toast.success('맛집이 성공적으로 제보되었습니다! 🎉');
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error(error);
      toast.error('제출 중 오류가 발생했습니다.');
    }
  };

  if (submitted) {
    return (
      <FormContainer>
        <FaCheckCircle size={48} color="green" />
        <h3>제보 감사합니다!</h3>
        <p>여러분의 제보로 캠퍼스 푸드맵이 더욱 풍성해집니다.</p>
        <button onClick={() => setSubmitted(false)}>
          다른 맛집 제보하기
        </button>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <h2>🍽️ 새로운 맛집 제보하기</h2>
      <form onSubmit={handleSubmit(onSubmit)}> {/* ✅ fetch("/") 제거 */}
        {/* input, textarea, select 전부 그대로 */}
        {/* ... */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '제출 중...' : '맛집 제보하기'}
        </button>
      </form>
    </FormContainer>
  );
}

export default SubmitRestaurant;

