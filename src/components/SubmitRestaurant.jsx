/* src/components/SubmitRestaurant.jsx */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';
import api from '../services/api'; // ✅ axios 인스턴스( BASE_URL = Render )

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  &:focus { outline: none; border-color: #667eea; }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  &:focus { outline: none; border-color: #667eea; }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s;
  &:focus { outline: none; border-color: #667eea; }
`;

const ErrorMessage = styled.span`
  color: #ff4757;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover { transform: scale(1.02); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  svg { font-size: 4rem; color: #4caf50; margin-bottom: 1rem; }
  h3 { color: #4caf50; margin-bottom: 1rem; }
`;

function SubmitRestaurant() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  // ✅ Render API로 JSON POST
  const onSubmit = async (form) => {
    // 서버 DTO에 맞게 필드 매핑
    const payload = {
      name: form.restaurantName,
      category: form.category,
      location: form.location,
      priceRange: form.priceRange || null,
      // 쉼표로 입력했다면 배열화, 비어있으면 []
      recommendedMenu: form.recommendedMenu
        ? form.recommendedMenu.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      review: form.review || null,
      submitter: {
        name: form.submitterName || null,
        email: form.submitterEmail || null
      }
    };

    try {
      const res = await api.post('/api/restaurants', payload);
      // 성공 UX
      setSubmitted(true);
      toast.success('맛집이 성공적으로 제보되었습니다! 🎉');
      reset();
      // 5초 뒤 다시 폼 화면으로
      setTimeout(() => setSubmitted(false), 5000);
      return res.data;
    } catch (err) {
      // 에러 메시지 파싱
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.message ||
        '제출 중 오류가 발생했습니다.';
      toast.error(msg);
      throw err;
    }
  };

  if (submitted) {
    return (
      <FormContainer>
        <SuccessMessage>
          <FaCheckCircle />
          <h3>제보 감사합니다!</h3>
          <p>여러분의 제보로 캠퍼스 푸드맵이 더욱 풍성해집니다.</p>
          <button onClick={() => setSubmitted(false)}>다른 맛집 제보하기</button>
        </SuccessMessage>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormTitle>🍽️ 새로운 맛집 제보하기</FormTitle>

      {/* RHF onSubmit → axios POST */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 🔻 Netlify hidden input 제거 (Render API에 불필요)
            <input type="hidden" name="form-name" value="restaurant-submit" /> */}

        <FormGroup>
          <Label htmlFor="restaurantName">맛집 이름 *</Label>
          <Input
            id="restaurantName"
            {...register("restaurantName", { required: "맛집 이름은 필수입니다" })}
            placeholder="예: OO식당"
          />
          {errors.restaurantName && <ErrorMessage>{errors.restaurantName.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">카테고리 *</Label>
          <Select
            id="category"
            {...register("category", { required: "카테고리를 선택해주세요" })}
          >
            <option value="">선택하세요</option>
            <option value="한식">한식</option>
            <option value="중식">중식</option>
            <option value="일식">일식</option>
            <option value="양식">양식</option>
            <option value="아시안">아시안</option>
            <option value="분식">분식</option>
            <option value="카페">카페</option>
            <option value="기타">기타</option>
          </Select>
          {errors.category && <ErrorMessage>{errors.category.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="location">위치 *</Label>
          <Input
            id="location"
            {...register("location", { required: "위치는 필수입니다" })}
            placeholder="예: 아주대학교 정문 도보 5분"
          />
          {errors.location && <ErrorMessage>{errors.location.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="priceRange">가격대</Label>
          <Input id="priceRange" {...register("priceRange")} placeholder="예: 8,000-12,000원" />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="recommendedMenu">추천 메뉴</Label>
          <Textarea
            id="recommendedMenu"
            {...register("recommendedMenu")}
            placeholder="예: 치즈닭갈비, 막국수, 볶음밥"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="review">한줄평</Label>
          <Textarea
            id="review"
            {...register("review")}
            placeholder="이 맛집만의 특별한 점을 알려주세요"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="submitterName">제보자 이름</Label>
          <Input id="submitterName" {...register("submitterName")} placeholder="선택사항" />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="submitterEmail">이메일</Label>
          <Input
            id="submitterEmail"
            type="email"
            {...register("submitterEmail", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "올바른 이메일 형식이 아닙니다"
              }
            })}
            placeholder="선택사항 (답변받을 이메일)"
          />
          {errors.submitterEmail && <ErrorMessage>{errors.submitterEmail.message}</ErrorMessage>}
        </FormGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '제출 중...' : '맛집 제보하기'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
}

export default SubmitRestaurant;
