// Защита 1. Проверяем куки на количество отправленных заявок и обрубаем очередную отправку после 2 попыток
if(Cookies.get('sent') == '10'){
    // Удаляем форму и на ее место вставляем текст
        $('#datas').empty().append('Вы отправили слишком много заявок. Попробуйте повторить позже. <br><br>От вас получены следующие данные: <br><br> <strong>Номер телефона:</strong> ' + Cookies.get('phone') + '<br><strong>Краткое описание:</strong> '  + Cookies.get('text'));
    }
    
    
    
        // ONCLICK IN-MODAL BUTTON
        
        // Вешаем событие на кнопку отправки
        $('#datas-btn').click(function(){
    
            // Очищаем поле с результатом 
            $('p.ressult').empty();
    
            // Защита 2. Проверяем наличие метки в виде CSS класса и блокируем повторную отправку заявки
            if($('#datas-btn').hasClass('sent')){
                $('p.ressult').css('color', 'red').append('Вы уже отправили заявку. Если была допущена ошибка — обновите страницу и отправьте заново.');
            }else{
    
                var f_phone = $('input.phone').val(),
                last_name = $('input.last_name').val(),
                first_name = $('input.first_name').val(),
                patronymic = $('input.patronymic').val(),
                birthday = $('input.birthday').val(),
                citizenship = $('input.citizenship').val(),
                region = $('input.region').val(),
                education = $('input.education').val(),
                service = $('input.service').val(),
                mail = $('input.mail').val(); 	  	
        
                // Проверяем корректность номера телефона (только РФ)
                if(f_phone == '' || !validatePhone(f_phone)){
    
                    $('p.ressult').css('color', 'red').append('Некорректно заполнен номер телефона');
    
                }else{
                    // Если Телефон корректный — выводим результат
                    $('p.ressult').css('color', 'red').append('Заявка отправлена!<br>Мы свяжемся с вами в ближайшее время');
    
                    // Защита 2. Вешаем метку в виде CSS класса и блокируем повторную отправку заявки
                    $('#datas-btn').addClass('sent');
    
                    // Заносим номер телефона и текст в куки
                    Cookies.set('phone', f_phone);
                Cookies.set('last_name', last_name);
                Cookies.set('first_name', first_name);
                Cookies.set('patronymic', patronymic);
                Cookies.set('birthday', birthday);
                Cookies.set('citizenship', citizenship);
                Cookies.set('region', region);
                Cookies.set('education', education);
                Cookies.set('service', service);
                Cookies.set('mail', mail);
    
                    // Защита 1. Даем две попытки на отправку заяявок. Фиксируем их в куках
                    if(!Cookies.get('sent')){
                        Cookies.set('sent', '1');
                    }else if(Cookies.get('sent') == '1'){
                        Cookies.set('sent', '2');
                    }				
    
                    //если все проверки пройдены формируем текстовое собщение				
                    var text = 'Новая заявка\n' + 
                            '*ФИО*: ' + last_name + ' ' + first_name + ' ' + patronymic + '\n' +
                            '*Дата рождения*: ' + birthday + '\n' +
                            '*Гражданство*: ' + citizenship + '\n' +
                            '*Регион проживания*: ' + region + '\n' +
                            '*Образование*: ' + education + '\n' +
                            '*Срочная служба*: ' + service + '\n' +
                            '*Телефон*: ' + f_phone + '\n' +
                            '*Почта*: ' + mail;
                
                    //и вызываем функцию отправки в телегу
                    send_tg(text);
    
                    // отладочное сообщение
                    // $('p.ressult').append('<br><br>' + f_phone + ', ' + f_descr);
             
                }
            
            }
    
        });
    
    // STATIC FUNCTIONS
    // Защита 3. Блокируем возможность вставки в поле с номером телефона, дабы отбить желание спамить нам заявки
    $('input.phone').bind('cut copy paste', function (e) {
        e.preventDefault();
    });
    
    // Валидация телефона через регулярные выражения
    function validatePhone(phone){
        let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
     return regex.test(phone);
    }
    
    // AJAX отправка данных в ТГ
    function send_tg(text){
    
        // var chatid = "-1001518691100",
        // token = "5707365668:AAFtz5CEMsOzNxS71b5v7EDRS_4zfYTSiKA";
                var chatid = '-1002247372621',
                        token = '7063416706:AAFbDY44oZRzNbHhmJ024nk7RTljvOy5X20',
                      z = $.ajax({
                    
                    type: "POST",  
                    url: "https://api.telegram.org/bot"+token+"/sendMessage?chat_id="+chatid,
                  data: "parse_mode=markdown&text="+encodeURIComponent(text), 
      }); 
    };
    