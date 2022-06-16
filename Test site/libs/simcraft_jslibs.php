<script type="text/javascript">var debug=<?=MODE_DEBUG
	?>;var lang='<?=$lang?>';<?php 
	if(isset($relocation)){ ?>
		setTimeout(relocationUrl, 500);
		function relocationUrl(){
			() => {
				location.href="<?=$relocation?>";
			}
		}
	<?php } ?></script>
<script type="text/javascript" src="https://kit.fontawesome.com/2bcc14d52b.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script type="text/javascript" src="js/scripts.js"></script>
<script type="text/javascript" src="js/preloader.js"></script>
<script type="text/javascript" src="js/texteditor.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/highlight.min.js"></script>
<script type="text/javascript">hljs.highlightAll();if(debug)console.log('Simcraft JSlibs Loaded');</script>
