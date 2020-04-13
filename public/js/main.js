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
});