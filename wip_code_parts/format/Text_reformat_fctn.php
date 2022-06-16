<?php
	public function lkval($str){
		return DOMAINE_PREFIX.DOMAINE_NAME.'/'.str_replace(' ', '_', $str);
	}
	public function lktrad($str){
		return str_replace('_', ' ', $str);
	}
	public function noAccent($str){
		$charaEquiv = [
			"À" => "A",
			"Á" => "A",
			"Â" => "A",
			"Ã" => "A",
			"Ä" => "A",
			"Å" => "A",
			"Ç" => "C",
			"È" => "E",
			"É" => "E",
			"Ê" => "E",
			"Ë" => "E",
			"Ì" => "I",
			"Í" => "I",
			"Î" => "I",
			"Ï" => "I",
			"Ñ" => "N",
			"Ò" => "O",
			"Ó" => "O",
			"Ô" => "O",
			"Õ" => "O",
			"Ö" => "O",
			"Ù" => "U",
			"Ú" => "U",
			"Û" => "U",
			"Ü" => "U",
			"Ý" => "Y",
			"ß" => "s",
			"à" => "a",
			"á" => "a",
			"â" => "a",
			"ã" => "a",
			"ä" => "a",
			"å" => "a",
			"ç" => "c",
			"è" => "e",
			"é" => "e",
			"ê" => "e",
			"ë" => "e",
			"ì" => "i",
			"í" => "i",
			"î" => "i",
			"ï" => "i",
			"ñ" => "n",
			"ò" => "o",
			"ó" => "o",
			"ô" => "o",
			"õ" => "o",
			"ö" => "o",
			"ù" => "u",
			"ú" => "u",
			"û" => "u",
			"ü" => "u",
			"ý" => "y",
			"ÿ" => "y",
			"Ā" => "A",
			"ā" => "a",
			"Ă" => "A",
			"ă" => "a",
			"Ą" => "A",
			"ą" => "a",
			"Ć" => "C",
			"ć" => "c",
			"Ĉ" => "C",
			"ĉ" => "c"
		];
	
		$res =  strtr($str, $charaEquiv);
		return strval($res);
	}
	public function convertEscapeScCode($str, $artId){
		$res = "";
		$tag = "";
		$param = "";
		$idCntr = 0;
		$intag = false;
		$inparam =false;
		$srt = " ".$str;
		
		$lastTag = "";

		for($i = 0; $i < strlen($str); $i++){
			
			if($lastTag == "script" || $lastTag == "script="){
				if($str[$i] == '['){
					$pretag = $str[$i].$str[$i+1].$str[$i+2].$str[$i+3].$str[$i+4].$str[$i+5].$str[$i+6].$str[$i+7].$str[$i+8];
					if($pretag == '[/script]'){
						$i += 8;
						$idCntr++;
						$id = $artId.'_'.$idCntr;
						$intag = false;
						$lastTag = "/script";
						$res .= $this->convertScTag('/script', "", $id);
					}else{
						$res.= $str[$i];
					}
				}else{
					$res.= $str[$i];

				}
			}else if($str[$i] == '\\'){
			}else if($inparam){
				if($str[$i] != ']' && $i < strlen($str)){
					$param .= $str[$i];
				}else if($str[$i] == ']'){
					$idCntr++;
					$inparam = false;
					$intag = false;
					$id = $artId.'_'.$idCntr;
					$lastTag = $tag;
					$res .= $this->convertScTag($tag, $param, $id);
				}
			}else if($intag){
				if($tag == "color=" || $tag == "url=" || $tag == "quote=" ||  $tag == "size=" || $tag == "img="){
					$inparam = true;
					$param = $str[$i];
				}else if($str[$i] != ']'){
					$tag .= $str[$i];
				}else if($str[$i] == ']'){
					$idCntr++;
					$id = $artId.'_'.$idCntr;
					$intag = false;
					$lastTag = $tag;
					$res .= $this->convertScTag($tag, $param, $id);
				}
			}else if($str[$i] == '[' && $str[$i - 1] != '\\'){
				$intag = true;
				$inparam = false;
				$tag = "";
				$param = "";
			}else{
				$res.= $this->hydrateScCode($str[$i]);
			}
		}
		return nl2br($res, false);
	}
	private function hydrateScCode($str){
		$ret = str_replace('"', '\"', $str);
		$ret = str_replace("'", "\'", $ret);
		$ret = str_replace("<", "\<'", $ret);
		return $ret;
	}
	private function convertScTag($tag, $param, $id){
		switch(strtolower($tag)){
			case 'img':
				return '<img style="max-width:100%" alt="img" src="'; 
			break;
			case 'img=':
				return '<img style="max-width:100%"  alt="'.$this->hydrateScCode($param).'" src="'; 
			break;
			case '/img':
				return '">'; 
			break;
			case 'b':
				return '<b>'; 
			break;
			case '/b':
				return '</b>'; 
			break;
			case 'i':
				return '<i>'; 
			break;
			case '/i':
				return '</i>'; 
			break;
			case 'u':
				return '<u>'; 
			break;
			case '/u':
				return '</u>'; 
			break;
			case 'strike':
				return '<strike>'; 
			break;
			case '/strike':
				return '</strike>'; 
			break;
			case 'center':
				return '<p style="text-align: center">'; 
			break;
			case '/center':
				return '</p>'; 
			break;
			case 'left':
				return '<p style="text-align: left">'; 
			break;
			case '/left':
				return '</p>'; 
			break;
			case 'right':
				return '<p style="text-align: right">'; 
			break;
			case '/right':
				return '</p>'; 
			break;
			case 'justify':
				return '<p style="text-align: justify">'; 
			break;
			case '/justify':
				return '</p>'; 
			break;
			case 'color=':
				return '<font color="'.$this->hydrateScCode($param).'">'; 
			break;
			case '/color':
				return '</font>'; 
			break;
			case 'bgcolor=':
				return '<font style="background-color:'.$this->hydrateScCode($param).';">'; 
			break;
			case '/bgcolor':
				return '</font>'; 
			break;
			case 'url=':
				return '<a href="'.$this->hydrateScCode($param).'">'; 
			break;
			case '/url':
				return '</a>'; 
			break;
			case 'quote':
				return '<fieldset class="topic_quote">'; 
			break;
			case 'quote=':
				return '<fieldset class="topic_quote"><legend>'.$this->getEscapeScQuote($param).'</legend>'; 
			break;
			case '/quote':
				return '</fieldset>'; 
			break;
			case 'spoiler':
				return '
				<div class="spoiler"><div class="spoiler-btn">'.$this->vocab['toglHide'].'</div><div class="spoiler-body">'; 
			break;
			case 'spoiler=':
				return '
				<div class="spoiler"><div class="spoiler-btn">'.$this->getEscapeScQuote($param).'</div><div class="spoiler-body">';
			break;
			case '/spoiler':
				return '</div></div>'; 
			break;
			case 'script':
				return '<pre class="scriptbox"><code class="scriptcontent language-javascript">'; 
			break;
			case 'script=':
				return '<pre class="scriptbox"><code class="scriptcontent language-'.$this->getEscapeScQuote($param).'">'; 
			break;
			case '/script':
				return '</code></pre>'; 
			break;
			case 'youtube':
				return '<iframe width="560" height="315" src="https://www.youtube.com/embed/'; 
			break;
			case '/youtube':
				return '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'; 
			break;
			case 'size=':
				return '<span style="font-size:'.floor(max( min(intval($param), 24), 8)).'px;">'; 
			break;
			case '/size':
				return '</span>'; 
			break;
			case 'tab':
				return '<i style="width:2em; min-width:2em; display:inline-block;"></i>';
			break;
			case 'title':
				return '<p style="font-size:2.4em;text-align:center;">';
			break;
			case '/title':
				return '</p>';
			break;
			case 'subtitle':
				return '<p class="subtitlpost"><i class="fa-solid fa-radiation"></i> ';
			break;
			case '/subtitle':
				return '</p>';
			break;
			case 'hr':
				return '<hr style="width:50%; margin: auto">';
				break;
			default:
				return "";
			break;
		}
	}
?>