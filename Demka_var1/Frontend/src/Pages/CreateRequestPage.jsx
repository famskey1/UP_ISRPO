import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestsAPI } from '../../API/RequestsAPI';
import { getTokenData } from '../../API/TokenUtils';
import '../css/RequestFormPage.css';

const CreateRequestPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        hometechtype: '',
        hometechmodel: '',
        problemdescryption: ''
    });
    const user = getTokenData();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.hometechtype || !formData.hometechmodel || !formData.problemdescryption) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        setLoading(true);
        
        try {
            const requestData = {
                hometechtype: formData.hometechtype,
                hometechmodel: formData.hometechmodel,
                problemdescryption: formData.problemdescryption,
                clientid: user?.userid,
                requeststatus: 'Новая заявка',
                startdate: new Date().toISOString().split('T')[0]
            };

            await RequestsAPI.create(requestData);
            alert('Заявка успешно создана!');
            navigate(user?.type === 'Заказчик' ? `/my-requests/${user.userid}` : '/requests');
        } catch (err) {
            alert('Ошибка: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            <div className="form-container">
                <h1>Создание новой заявки</h1>
                
                <form onSubmit={handleSubmit} className="request-form">
                    <div className="form-group">
                        <label>Тип техники <span className="required">*</span></label>
                        <input
                            type="text"
                            name="hometechtype"
                            value={formData.hometechtype}
                            onChange={handleInputChange}
                            placeholder='Напишите тип техники'
                        >
                        </input>
                    </div>

                    <div className="form-group">
                        <label>Модель техники <span className="required">*</span></label>
                        <input
                            type="text"
                            name="hometechmodel"
                            value={formData.hometechmodel}
                            onChange={handleInputChange}
                            placeholder="Например: Indesit DS 316 W"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание проблемы <span className="required">*</span></label>
                        <textarea
                            name="problemdescryption"
                            value={formData.problemdescryption}
                            onChange={handleInputChange}
                            placeholder="Подробно опишите проблему..."
                            rows="6"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="btn-submit">
                            {loading ? 'Создание...' : 'Создать заявку'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            className="btn-cancel"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRequestPage;