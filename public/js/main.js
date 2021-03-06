$(function () {  
  if ($('textarea#ta').length) {
    ClassicEditor.create(document.querySelector( '#ta' )).then(() => {
      console.log('editor initialized');
    }).catch((err) => {
      console.log(err);
    });
  }

  $('a.confirmDeletion').on('click', () => {
    if (!confirm('Are you sure you want to delete')) {
      return false;
    }
  });

  $('a.clearcart').on('click', () => {
    if (!confirm('Are you sure you want to clear your cart?')) {
      return false;
    }
  });

  $('.buynow').on('click', (e) => {
    e.preventDefault();

    $.get('/cart/buynow', () => {
      $('form.pp input[type=image]').click();
      $('.ajaxbg').show();
    });
  });
});