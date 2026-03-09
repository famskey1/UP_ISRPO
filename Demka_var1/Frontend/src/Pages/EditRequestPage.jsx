import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RequestsAPI } from '../../API/RequestsAPI';
import { getTokenData, hasRole } from '../../API/TokenUtils';
import '../css/RequestFormPage.css';

const EditRequestPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        requestid:'',
        hometechtype: '',
        hometechmodel: '',
        problemdescryption: '',
        requeststatus: '',
        repairparts: '',
        masterid: '',
        clientid: ''
    });
    const user = getTokenData();

    useEffect(() => {
        loadRequest();
    }, [id]);

    const loadRequest = async () => {
        try {
            const data = await RequestsAPI.getOne(id);
            setFormData({
                requestid: data.requestid,
                hometechtype: data.hometechtype || '',
                hometechmodel: data.hometechmodel || '',
                problemdescryption: data.problemdescryption || '',
                requeststatus: data.requeststatus || '',
                repairparts: data.repairparts || '',
                masterid: data.masterid || '',
                clientid: data.clientid || ''
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const requestData = {
                requestid: parseInt(id),
                hometechtype: formData.hometechtype,
                hometechmodel: formData.hometechmodel,
                problemdescryption: formData.problemdescryption,
                requeststatus: formData.requeststatus,
                repairparts: formData.repairparts || null,
                masterid: formData.masterid ? parseInt(formData.masterid) : null, 
                clientid: parseInt(formData.clientid) 
            };

            if (formData.requeststatus === 'Готова к выдаче') {
                requestData.completiondate = new Date().toISOString().split('T')[0];
            }
            await RequestsAPI.update(id, requestData);

            alert('Заявка успешно обновлена!');
            navigate(-1);
        } catch (err) {
            alert('Ошибка: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить заявку?')) return;
        
        try {
            await RequestsAPI.delete(id);
            alert('Заявка удалена');
            navigate(-1);
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    const canEdit = hasRole('Админ') || hasRole('Мастер') || hasRole('Менеджер');

    return (
        <div className="form-page">
            <div className="form-container">
                <h1>Редактирование заявки №{id}</h1>
                
                <form onSubmit={handleSubmit} className="request-form">
                    <div className="form-group">
                        <input type="hidden" name="clientid" value={formData.clientid} />
                        <label>Тип техники</label>
                        <input
                            type="text"
                            name="hometechtype"
                            value={formData.hometechtype}
                            onChange={handleInputChange}
                            required
                            disabled={!canEdit}
                        />
                    </div>

                    <div className="form-group">
                        <label>Модель техники</label>
                        <input
                            type="text"
                            name="hometechmodel"
                            value={formData.hometechmodel}
                            onChange={handleInputChange}
                            required
                            disabled={!canEdit}
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание проблемы</label>
                        <textarea
                            name="problemdescryption"
                            value={formData.problemdescryption}
                            onChange={handleInputChange}
                            rows="4"
                            required
                            disabled={!canEdit}
                        />
                    </div>

                    <div className="form-group">
                        <label>Статус</label>
                        <select
                            name="requestStatus"
                            value={formData.requeststatus}
                            onChange={handleInputChange}
                            disabled={!canEdit}
                        >
                            <option value="Новая заявка">Новая заявка</option>
                            <option value="В процессе ремонта">В процессе ремонта</option>
                            <option value="Готова к выдаче">Готова к выдаче</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Использованные запчасти</label>
                        <textarea
                            name="repairParts"
                            value={formData.repairparts}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Укажите запчасти через запятую"
                            disabled={!canEdit}
                        />
                    </div>

                    <div className="form-actions">
                        {canEdit && (
                            <>
                                <button type="submit" disabled={saving} className="btn-submit">
                                    {saving ? 'Сохранение...' : 'Сохранить изменения'}
                                </button>
                                {hasRole('Админ') && (
                                    <button 
                                        type="button" 
                                        onClick={handleDelete} 
                                        className="btn-delete"
                                    >
                                        Удалить заявку
                                    </button>
                                )}
                            </>
                        )}
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

export default EditRequestPage;