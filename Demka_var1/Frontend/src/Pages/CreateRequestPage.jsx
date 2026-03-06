import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestsAPI } from '../../API/RequestsAPI';
import { getTokenData } from '../../API/TokenUtils';
import '../css/RequestFormPage.css';

const CreateRequestPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        homeTechType: '',
        homeTechModel: '',
        problemDescryption: ''
    });
    const user = getTokenData();

    const techTypes = [
        'Холодильник',
        'Стиральная машина',
        'Фен',
        'Тостер',
        'Мультиварка',
        'Микроволновая печь',
        'Телевизор',
        'Ноутбук',
        'Другое'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.homeTechType || !formData.homeTechModel || !formData.problemDescryption) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        setLoading(true);
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('hometechtype', formData.homeTechType);
            formDataToSend.append('hometechmodel', formData.homeTechModel);
            formDataToSend.append('problemdescryption', formData.problemDescryption);
            formDataToSend.append('clientid', user?.userid);
            formDataToSend.append('requeststatus', 'Новая заявка');
            formDataToSend.append('startdate', new Date().toISOString().split('T')[0]);

            await RequestsAPI.create(formDataToSend);
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
                        <select
                            name="homeTechType"
                            value={formData.homeTechType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Выберите тип техники</option>
                            {techTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Модель техники <span className="required">*</span></label>
                        <input
                            type="text"
                            name="homeTechModel"
                            value={formData.homeTechModel}
                            onChange={handleInputChange}
                            placeholder="Например: Indesit DS 316 W"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание проблемы <span className="required">*</span></label>
                        <textarea
                            name="problemDescryption"
                            value={formData.problemDescryption}
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
                            ✖ Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRequestPage;