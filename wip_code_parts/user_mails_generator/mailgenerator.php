<?php
	//MAILING MANAGER
	private function lastMailId(){
		$sql = "SELECT `id` FROM `mails` ORDER BY `id` DESC LIMIT 1";
		$value = Array();
		$res = $this->reqFetchAll($sql, $value);
		if($res[0])
			return $res[0]['id'] + 1;
		return 1;
	}
	private function getMailBdd($mailId){
		$sql = "SELECT * FROM `mails` WHERE `id` = ?";
		$values = Array($mailId);
		$res = $this->reqFetchAll($sql, $values);

		if($res[0])
			return $res[0];
		return $this->getDefaultMailData();
	}
	private function getMailTemplateBdd($typeId){
		$sql = "SELECT * FROM `mail_temp` WHERE `id` = ?";
		$values = Array($typeId);
		$res = $this->reqFetchAll($sql, $values);

		if($res[0])
			return $res[0];
		return $this->getDefaultMailTemplateBdd();
	}
	/** MAIL ACTIONS **/
	private function presubscribMail($mail){
		return $this->testingMail($mail);
	}
	private function testingMail($mail){	
		$to				= $mail;
		$from			= 'noreply@'.$this->domain;
		$headers		= "From: ".$from."\r\nReply-To: ". $from ."\r\nX-Mailer: PHP/".phpversion()."\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n";
		$subject		= "TEST";
		$message		= "Mail TEST";

		return mail($to, $subject, $message, $headers);	
	}
	public function connectMail($login, $lang){
		$user = $this->getUserByLoginCo($login);
		if($user['survey_co'] == 1){
			$mail = $user['mail'];
			$from    = 'noreply@'.$this->domain;
			$headers = "From: ".$from."\r\nReply-To: ". $from ."\r\nX-Mailer: PHP/".phpversion()."\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n";
			$subject = $this->vocab['mlCoSubj'];
			$message = $this->getMailCoFrmt($login, $lang);
			mail($mail, $subject, $message, $headers);
		}
	}
	public function forgtMail($login){
		$user = $this->getUserByLoginCo($login);
		$from    = 'noreply@'.$this->domain;
		$headers = "From: ".$from."\r\nReply-To: ". $from ."\r\nX-Mailer: PHP/".phpversion()."\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n";
		$token = $this->reinitToken($user['id']);
		$activate_link = 'http://'.$this->domain.'/'.$this->vocab['rstorpswd'].'-'.$user['id'].'-'.$token;
		$message = $this->getMailForgtFrmt($login, $activate_link, $lang);
		mail($mail, $subject, $message, $headers);
	}
	public function activationMail($userId, $lang){

		$user			= $this->userData($userId);
		$sender			= $this->userData(1);

		$to				= $user['mail'];
		$from			= 'noreply@'.$this->domain;
		$headers		= "From: ".$from."\r\nReply-To: ". $from ."\r\nX-Mailer: PHP/".phpversion()."\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n";
		$subject		= $this->getMailSuject($this->getMailTemplateBdd(1), $user['pseudo'], $lang);

		$mailId			= $this->lastMailId(1, $user['id']);
		$message		= $this->getMailActivFrmt($user, $sender, $lang, $mailId);

		$this->saveMail(1, 1, $userId, $message, $mailId);

		mail($to, $subject, $message, $headers);
	}
	private function saveMail($type, $senderId, $recipId, $message, $mailId){
		$sql = "INSERT INTO `mails` ( `id`, `type`, `senderId`, `recipId`, `content`, `timestamp`)".
		"VALUES (?, ?, ?, ?, ?, ?);";

		$values = Array($mailId, $type, $senderId, $recipId, $message, time());

		$this->reqExec($sql, $values);
		return $mailId;
	}
	/** MAIL CONTENTS**/
	public function getMailActivFrmt($user, $sender, $lang, $mailId){
		return $this->getMailActivTemplate($user, $sender, $mailId, $lang);
	}
	/** MAIL TEMPLATES **/
	private function getMailActivTemplate($user, $sender, $mailId, $lang){
		$type		= $this->getMailTemplateBdd(1);

		return $this->getMailTop($type, $user['pseudo'], $lang).
		$this->getMailActivContent($type, $user, $lang).
		$this->getMailBottom($type, $sender, $user['id'], $mailId, $lang);
	}
	/**  MAIL PARTS **/
	private function getMailTop($type, $userNm, $lang){

		$data = $this->getMailTopData($type, $userNm, $lang);

		return'<!doctype html>
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
				<title>'.$data['title'].'</title>'.
				$this->getMailCSS()
			.'</head>
			<body style="background-color: #f3f2ef; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
				<span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">'.
					$data['preheader']
				.'</span>
				<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
					<tr>
						<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
						<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
							<div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">'.
								$this->getMailTopLogo($data['logo'], $data['logo_link'])
								.'<table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
									<tr>
										<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">';
											
	}
	private function getMailTopLogo($logo, $link){ 
		return
								'<table'.$this->mailClass(2).'>
									<tr>
										<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
											<a href="'.$link.'">'.
												$this->getMailLogo($logo)
											.'</a>
										</td>
									</tr>
								</table>';
	}
	private function getMailCSS(){
		return
		'<style>
		@media only screen and (max-width: 620px) {
			table.body h1 {
				font-size: 28px !important;
				margin-bottom: 10px !important;
			}
			table.body p,table.body ul,	table.body ol,table.body td,table.body span,table.body a{
				font-size: 16px !important;
			}
			table.body .wrapper,table.body .article {
				padding: 10px !important;
			}
			table.body .content {
				padding: 0 !important;
			}
			table.body .container {
				padding: 0 !important;
				width: 100% !important;
			}
			table.body .main {
				border-left-width: 0 !important;
				border-radius: 0 !important;
				border-right-width: 0 !important;
			}
			table.body .btn table {
				width: 100% !important;
			}
			table.body .btn a {
				width: 100% !important;
			}
			table.body .img-responsive {
				height: auto !important;
				max-width: 100% !important;
				width: auto !important;
			}
		}
		@media all {
			.ExternalClass {
				width: 100%;
			}
			.ExternalClass,.ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{
				line-height: 100%;
			}
			.apple-link a {
				color: inherit !important;
				font-family: inherit !important;
				font-size: inherit !important;
				font-weight: inherit !important;
				line-height: inherit !important;
				text-decoration: none !important;
			}
			#MessageViewBody a {
				color: inherit;
				text-decoration: none;
				font-size: inherit;
				font-family: inherit;
				font-weight: inherit;
				line-height: inherit;
			}
			.btn-primary table td:hover {
				background-color: #34495e !important;
			}
			.btn-primary a:hover {
				background-color: #34495e !important;
				border-color: #34495e !important;
			}
		}
		</style>';
	}
	private function getMailActivContent($type, $user, $lang){
		$data = $this->getMailActivData($type, $user, $lang);
		return'<table'.$this->mailClass(2).'>
			<tr>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
					<p style="'.$this->mailClass(1).'">'.$data['top'].'</p>
					<p style="'.$this->mailClass(1).'">'.$data['contt1'].'</p>'.
					$this->getMailActionBtn($data['actlink'], $data['action'])
					.'<p style="'.$this->mailClass(1).'">'.$data['contt2'].'</p>
					<p style="'.$this->mailClass(1).'">'.$data['end'].'</p>
				</td>
			</tr>
		</table>';
	}
	private function mailClass($classId){
		switch($classId){
			case 1:
				return 'font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;';
			break;
			case 2:
				return ' role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%"';
			break;
			default:
			break;
		}
	}
	private function getMailActionBtn($link, $action){

		return'
					<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%" class="btn btn-primary">
						<tbody>
							<tr>
								<td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
									<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
										<tbody>
											<tr>
												<td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #3498db;" valign="top" align="center" bgcolor="#3498db">
													<a href="'.$link.'" target="_blank" style="border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #3498db; border-color: #3498db; color: #ffffff;">
														'.$action.'
													</a>

												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>';
	}
	private function getMailBottom($type, $sender, $userId, $mailId, $lang){
		$data = $this->getMailBottomData($type, $userId, $lang);
		return '						</td>
									</tr>
								</table>
								<div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
									<table'.$this->mailClass(2).'>
										<tr>
											<td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">'.
												$this->getMailFooter($type, $sender, $mailId, $lang)
											.'</td>
										</tr>	
										<tr>
											<td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">'.
												$data['unsub_msg']
												.'<a href="'.$data['unsub_link'].'" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">'.
													$data['unsub_act']
												.'</a>
												<br>
												<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">'.
													$data['brand']
												.'</span>
												<br>
											</td>
										</tr>
									</table>
								</div>
							</div>
						</td>
						<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
  					</tr>
				</table>
			</body>
		</html>';
	}
	private function getMailFooter($type, $sender, $mailId, $lang){
		$data = $this->getMailFooterData($sender);
		return
		'<table width="480" style="font-size: 11pt; font-family: Arial, sans-serif;" cellpadding="0" cellspacing="0" border="0"><tbody>
			<tr>
				<td ng-if="showField(\'logo\')" width="160" style="font-size: 10pt; font-family: Arial, sans-serif; width: 160px; vertical-align: top;" valign="top">
					<a href="http://'.$this->domain.'" target="_blank">
						<img border="0" alt="Logo" width="125" style="width:125px; height:auto; border:0;" src="'.$data['sdrAvtrLk'].'">
					</a>
				</td>
				<td valign="top" width="270" style="width:270px; vertical-align: top; line-height:11px; border-right:2px solid #29abe1">
					<table cellpadding="0" cellspacing="0" border="0" width="270"><tbody>
						<tr>
							<td style="font-size:12pt; height:14px; line-height:14px">
								<strong style="font-family: Arial, sans-serif;font-size: 12pt;color:#29abe1;">
									<a href="'.$data['sdrLink'].'">'.
										$data['sdrNm']
									.'</a>
								</strong>
							</td>
						</tr>
						<tr>
							<td style="font-size:9pt; height:14px; line-height:14px">
								<span style="font-family: Arial, sans-serif; font-size:9pt; color:#000000;">'.
									$this->getMailRankIco($data['sdrRank'])
								.'</span>
								<span style="font-family: Arial, sans-serif; font-size:9pt; color:#000000;" >| '.
									$data['sdrRank']							
								.'</span>			
							</td>
						</tr>
						<tr>
							<td style="height:14px; line-height:14px">&nbsp;</td>
						</tr>
						<tr>
							<td style="font-size:9pt; height:14px; line-height:14px">
								<span style="font-family: Arial, sans-serif;color:#000000;FONT-SIZE: 9pt">
									<a href="'.$data['sdrPg'].'">'.
										$this->vocab['usrPersPg']
									.'</a>
								</span>
								<span style="font-family: Arial, sans-serif;color:#000000;FONT-SIZE: 9pt">| 
									<a href="'.$data['sdrPrfl'].'">'.
										$this->vocab['usrPrflPg']
									.'</a>
								</span>			
							</td>
						</tr>
						<tr>
							<td style="font-size:9pt; height:12px; line-height:12px">
								<span style="font-family: Arial, sans-serif;color:#000000;FONT-SIZE: 9pt">
									<a href="mailto:'.$data['sdrMl'].'">'.
										$data['sdrMl']
									.'</a>
								</span>		
							</td>
						</tr>	
						<tr>
							<td style="height:14px; line-height:14px">&nbsp;</td>
						</tr>		
						<tr>
							<td style="font-size:9pt; height:12px; line-height:12px">
								<span style="font-family: Arial, sans-serif;color:#000000;FONT-SIZE: 9pt">'.
									$this->adressOfficial
								.'</span>		
							</td>
						</tr>
						<tr>
							<td style="font-size:9pt; height:12px; line-height:12px">
								<a href="http://'.$this->domain.'" target="_blank" rel="noopener" style=" text-decoration:none;">
									<strong style="color:#29abe1; font-family:Arial, sans-serif; font-size:9pt">'.
										$this->domain
									.'</strong>
								</a>	
							</td>
						</tr>	
					<tbody></table>
				</td>'.
				$this->getMailSocial()
			.'</tr>'.
			$this->getMailBanner().
			$this->getMailLegal($type, $mailId, $lang)

		.'</tbody></table>';
	}
	private function getMailLegal($type, $mailId, $lang){
		return
		'<tr>
			<td colspan="4" style="padding-top:15px; line-height:14px; font-size: 7.5pt; color: #808080; font-family: Arial, sans-serif;">'.
				$this->getMailDisclaimer($type, $mailId, $lang)
				.'<a href="https://'.$this->domain.'/'.$this->vocab['conditio'].'" target="_blank" rel="noopener">'.
					$this->vocab['conditio']
				.'</a>
			</td>
		</tr>';
	}
	private function getMailDisclaimer($type, $mailId, $lang){
		return
		'<a href="https://'.$this->domain.'/Mails-'.$mailId.'">'.
			$type['see_on_brwsr_'.$lang]
		.'</a><br>'.
		str_replace('£', $this->domain, $type['legal_'.$lang]).
		'<a href="http://'.$this->domain.'/'.$this->vocab['conditio'].'">'.
			$this->vocab['conditio']
		.'</a>.<br>';
	}	
	private function getMailBanner(){
		$data = $this->getMailBannerData();
		return
		'<tr>
			<td colspan="4" style="padding-top:15px;">
				<a href="'.$data['publink'].'" target="_blank" rel="noopener">
				<img border="0" src="'.$data['pub_img'].'" alt="Banner" width="479" style="max-width:479px; height:auto; border:0;">
				</a>
			</td>
		</tr>';
	}
	private function getMailSocial(){
		$data = $this->getSocialLink();
		$strt = 'https://i65.servimg.com/u/f65/17/93/76/49/';
		$end = '10.png';
		return
		'<td style="vertical-align: top; padding-left:10px" valign="top" width="35">
			<table cellpadding="0" cellspacing="0" border="0" width="25">
				<tr >
					<td width="25" height="30" valign="top" style="vertical-align: top;">
						<a href="'.$data['fb'].'" target="_blank" rel="noopener">
							<img border="0" width="26" height="25" src="'.$strt.'fb'.$end.'" alt="facebook icon" style="border:0; height:25px; width:26px;">
						</a>
					</td>
				</tr>
				<tr >
					<td width="25" height="30" valign="top" style="vertical-align: top;">
						<a href="'.$data['gh'].'" target="_blank" rel="noopener">
							<img border="0" width="26" height="25" src="'.$strt.'gh'.$end.'" alt="github icon" style="border:0; height:25px; width:26px;">
						</a>
					</td>
				</tr>
				<tr >
					<td width="25" height="30" valign="top" style="vertical-align: top;">
						<a href="'.$data['yt'].'" target="_blank" rel="noopener">
							<img border="0" width="26" height="25" src="'.$strt.'yt'.$end.'" alt="youtube icon" style="border:0; height:25px; width:26px">
						</a>
					</td>
				</tr>			
			</table>
		</td>
		<td style="vertical-align: top;" valign="top" width="25">
			<table cellpadding="0" cellspacing="0" border="0" width="25">	
				<tr>
					<td style="height:12px; font-size:1px" height="12">
						&nbsp;
					</td>
				</tr>
				<tr>
					<td width="25" height="30" valign="top" style="vertical-align: top;">
						<a href="'.$data['ln'].'" target="_blank" rel="noopener">
							<img border="0" width="26" height="25" src="'.$strt.'ln'.$end.'" alt="linkedin icon" style="border:0; height:25px; width:26px;">
						</a>
					</td>
				</tr>
				<tr >
					<td width="25" height="30" valign="top" style="vertical-align: top;">
						<a href="'.$data['it'].'" target="_blank" rel="noopener">
							<img border="0" width="26" height="25" src="'.$strt.'it'.$end.'" alt="instagram icon" style="border:0; height:25px; width:26px;">
						</a>
					</td>
				</tr>
				<tr >
					<td width="25" height="30" valign="top" style="vertical-align: top;">
						<a href="'.$data['tw'].'" target="_blank" rel="noopener">
							<img border="0" width="26" height="25" src="'.$strt.'tw'.$end.'" alt="pinterest icon" style="border:0; height:25px; width:26px">
						</a>
					</td>
				</tr>			
			</table>
		</td>';
	}
	/** MAIL DATA **/
	private function getSocialLink(){
		return[
			'fb' => "https://www.facebook.com/omnipr3z/",
			'gh' => "https://github.com/0mniPr3Z",
			'yt' => "https://www.youtube.com/channel/UCbJnDBw1zWHfwcU2s-sp9dQ",
			'ln' => "https://www.linkedin.com/in/pierre-andr%C3%A9-hernandez-11631b152/",
			'it' => "https://www.instagram.com/0mni.pr3z/",
			'tw' => "https://www.twitch.tv/0mnipr3z"
		];
	}
	private function WIP_getActivData($user, $sender, $lang, $mailId){
		$token = $this->reinitToken($user['id']);
		$activlink = 'http://'.$this->domain.'/activation-'.$user['id'].'-'.$token;
		$message = $this->getMailActivFrmt($user, $sender, $activlink, $lang, $mailId);
		$userNm 					= $user['pseudo'];
		$exp['mail'] 				= "contact@".$this->domain;
		$data['mailId']				= $mailId;
		$data['ml_actlink']			= $activate_link;
		$data['ml_domain']			= $this->domain;
		$data['ml_unsublink']		= 'http://unsubscribe-'.$userNm;
		$data['ml_logolk']			= 'https://i65.servimg.com/u/f65/17/93/76/49/banner12.jpg';
		$data['ml_avatarlk']		= 'https://i65.servimg.com/u/f65/17/93/76/49/ml_'.$exp['avatar'].'10.png';
		$data['ml_logo']			= $this->getLogo($data['ml_logolk']);

		if($lang == 'fr'){
			$data['title']			= "Activez votre compte sur ".$this->domain;
			$data['preheader']		= "Cliquez sur le lien present dans ce mail pour activer votre compte sur ".$this->domain;
			$data['ml_top']			= "Bonjour ".$userNm.",";
			$data['ml_contt1']		= "Veuillez prendre une minute pour compléter votre inscription en confirmant votre adresse e-mail. Il suffit de cliquer sur le bouton ci-dessous !";
			$data['ml_action']		= "Enregistrer mon e-mail";
			$data['ml_contt2']		= "Il vous suffira ensuite de vous connecter pour accéder au contenu complet du site et pour participer à nos avantures extraordinaires.";
			$data['ml_end']			= "Bienvenue dans la communauté, et à très vite sur <a href='".$this->domain."'>".$this->domain."</a> !";
			$data['ml_brand']		= "Bonjour ".$userNm;
			$data['ml_unsub']		= '<br>Vous ne souhaitez plus recevoir nos emails ?';
			$data['ml_unsubact']	= 'Se Désinscrire';
		}else{
			$data['title']			= "Activez votre compte sur ".$this->domain;
			$data['preheader']		= "Cliquez sur le lien present dans ce mail pour activer votre compte sur ".$this->domain;
			$data['ml_top']			= "Bonjour ".$userNm.",";
			$data['ml_contt1']		= "Veuillez prendre une minute pour compléter votre inscription en confirmant votre adresse e-mail. Il suffit de cliquer sur le bouton ci-dessous !";
			$data['ml_action']		= "Enregistrer mon e-mail";
			$data['ml_contt2']		= "Il vous suffira ensuite de vous connecter pour accéder au contenu complet du site et pour participer à nos avantures extraordinaires.";
			$data['ml_end']			= "Bienvenue dans la communauté, et à très vite sur <a href='".$this->domain."'>".$this->domain."</a> !";
			$data['ml_brand']		= "&trade;2022 Shooter-Z &trade;2022 0mniPr3z";
			$data['ml_unsub']		= '<br>Vous ne souhaitez plus recevoir nos emails ?';
			$data['ml_unsubact']	= 'Se Désinscrire';
		}
	}
	private function getMailTopData($type, $userNm, $lang){
		$data = [];
		$data['logo_link']			= $type['logo_hdr_url'];
		$data['title']				= $this->getMailSuject($type, $userNm, $lang);
		$data['preheader']			= $type['preheader_'.$lang];
		$data['logo']				= $data['logo_link'];
		return $data;
	}
	private function getMailActivData($type, $user, $lang){
		$tokenstamp					= time() + 604800;
		$token 						= $this->reinitToken($user['id'], $tokenstamp);
		$activlink					= 'http://'.$this->domain.'/activation-'.$user['id'].'-'.$token;

		$data = [];
		$data['top']				= $type['msgstart_'.$lang].' '.$user['pseudo'].',';
		$data['contt1']				= $type['msgtop_'.$lang];
		$data['actlink']			= $activlink;
		$data['action']				= $type['action_nm_'.$lang];
		$data['contt2']				= $type['msgbtm_'.$lang].' '.$this->onlyDate($tokenstamp).'.';			
		$data['end']				= $type['msg_end_'.$lang];
		return $data;
	}
	private function getMailBottomData($type, $userId, $lang){
		$data = [];
		$data['unsub_link']		= $this->lkval('Mail_'.$this->lkval($type['unsubscribe_vocab_'.$lang]).$userId.$type['unsubscribe_link']);
		$data['unsub_msg']		= $type['unsubscribe_msg_'.$lang];
		$data['unsub_act']		= $type['unsubscribe_vocab_'.$lang];
		$data['brand']			= $type['brand'];
		return $data;
	}
	private function getMailFooterData($sender){
		$data['sdrAvtrLk']		= 'https://i65.servimg.com/u/f65/17/93/76/49/ml_'.$sender['avatar'].'10.png';	
		$data['sdrLink']		= 'http://'.$this->domain.'/Utilisateur-'.$sender['id'];
		$data['sdrNm']			= $sender['pseudo'];
		$data['sdrMl']			= $sender['mail'];
		$data['sdrRank']		= $sender['rank'];
		$data['sdrPg']			= 'http://'.$this->domain.'/Page_Perso-'.$sender['id'].'-'.$sender['pseudo'];
		$data['sdrPrfl']		= $data['sdrLink'];
		return $data;
	}
	private function getMailBannerData(){
		$art = $this->getTopArticle();
		$data['publink']	= "https://".$this->domain."/".$this->vocab['blog']."-".strtolower(date('M-Y', $art['timestamp']));
		$data['pub_img']	= $art['mail_img'];
		return $data;
	}
	/** MAIL ASSETS **/
	private function getSvgLogo(){
		return '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
		width="1021px" height="334px" viewBox="0 0 1021 334" enable-background="new 0 0 1021 334" xml:space="preserve">
		<image id="image0" width="1021" height="334" x="0" y="0"
		href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA/0AAAFOCAMAAADjII2gAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
		AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABOFBMVEWulZWulZWulZWulZWu
		lZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWu
		lZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWu
		lZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWu
		lZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWu
		lZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWulZWu
		lZWulZWulZWulZX///+DBhf/AAAAZnRSTlMAr+z56ahCrOD23wbQ/Oe1zT7a+9Xb3B6d9/1t/kdM
		hSOl83P4xcqx4u7t8poSONZp68xgs/qjf+T1VzOrZRjXz8Z8LilwiZG8wdLo6vH08NjTw723oJiM
		gXdcUQzAyVOU5bnv3Y6DX9wrAAAAAWJLR0RnW9PpswAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0
		SU1FB+YDBQYgCZRiOGkAACaGSURBVHja7V15Y9PG0zYJRwmEywSIMRBSU+KG60cIJJxtoJwplEIp
		Rwq0b6vv/xFeCDksS6ud2Z1jZc3zR0usPZ55Zh6tJEtyq2Uw1As7xsY3sXOXNhmDwSCE3Xu+25sN
		YkKbkcFgkMC+/ZPZMA5okzIYDPw4OJ6V4JA2LYPBwIvDR9pZOY5qUzMYDKxwef8LprS5GQwGRhzL
		KqBNzmAwcOH4iekq82ed49oMDQYDC062Mw+6p7Q5GgwGBpzu+sz/BSe1WRoMBnKc3gkwf5ad0eZp
		MBhoMXN2FmT+LPtem6rBYCDFUaD3s6ynTdVgMFDiHNj8WfaDNlmDwUCH8wjzZ9kObboGg4EIp+ZQ
		5s+62oQNBgMR9uLMn2V9bcYGg4EEP2LNn2Xz2pwNBgMBLuDNn2V7tVkbDIZ4HAlxfzanTdtgMERi
		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
		OSswMzowMC1ufL4AAAAASUVORK5CYII=" />
		</svg>';
	}
	private function getMailLogo($link){
		return '<img src="'.$link.'" alt="Shooter-Z" style="width:60%;max-width:60%;margin:0;margin-left:20%" width="60%><br><br>';
	}	
	private function getMailRankIco($rank){
		return
		'<img src="https://i65.servimg.com/u/f65/17/93/76/49/rk_'.$rank.'10.png" alt="" width="16" style="width:16px;"> '
		.$this->vocab['usrRank'.$rank];
	}
	private function getMailSuject($type, $userNm, $lang){
		return $type['subject_strt_'.$lang].' '.$userNm.$type['subject_end_'.$lang];
	}
?>