<?php
abstract class Sc_Core {
	protected
		$debug_log		= [],
		$debug_activ	= false;

	//INITIALIZE
	public function __construct($debug_activation){
		if(MODE_DEBUG) $this->debugInit($debug_activation);
		$this.debug_log_push('INITIALIZE SC CORE','Sc_Core->__construct','info',[]);
		$this->db = $this->db_connect();
	}

	//DEBUGGER
	protected function debug_initialize($debug_activation){
		$this->debug_activ = $debug_activation;
	}
	protected function need_debugger(){
		return MODE_DEBUG && $this->$debug_active;
	}
	protected function debug_log_push($txt, $src, $type, $var_list){
		if($this->need_debugger()){
			array_push($this->debug_log, [
				'txt' 	=> $txt,
				'src'	=> $src,
				'type'	=> $type,
				'var'	=> $var_list
			]);
		}
	}
	public function debug_log_display($show_var){
		if($this->need_debugger()){
			echo'<hr>SHOOTCRAFT DEBUGGER<hr>';
			for($i = 0; $i < count($this->debug_log); $i++){
				$log = $this->debug_log[$i];
				echo strtoupper($log['type']).$log['txt'].'<br><b>- IN: '.$log['src'].'</b><br>';
				if(count($log['var']) > 0 && $show_var){
					for($j = 0; $j < count($log['var']); $j++){
						var_dump($log['var'][$j]);
					}
				}
				echo'<hr>';
			}
		}
	}
	public function debug_log_displaylast($show_var){
		if($this->need_debugger()){
			if(count($this->debug_log) > 0){
				echo'<hr>SHOOTCRAFT DEBUGGER (last log)<hr>';
				$log = $this->debug_log[count($this->debug_log) - 1];
				echo strtoupper($log['type']).$log['txt'].'<br><b>- IN: '.$log['src'].'</b><br>';
			}
		}
	}
	protected function
			

	//DATABASE MANAGER
	private function db_connect(){
		try{
			$pdo = new PDO(
				"mysql:host=".DB_HOSTNAME.";dbname=".DB_NAME.";charset=utf8",
				DB_USERNAME,
				DB_PASSWORD,
				array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8')
			);
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this.debugLog('Connexion a la bdd réussie', 'Sc_Core->db_connect','info', []);
			return $pdo;
		}catch(PDOException $e){
			$this.debugLog('Erreur : ' . $e->getMessage(),'Sc_Core->db_connect','error',[]);
		}
	}
	
	private function db_connect(){
		try{
			$pdo = new PDO(
				"mysql:host=".$this->host.";dbname=".$this->dbname.";charset=utf8",
				$this->username,
				$this->password,
				array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8')
			);
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$debug = 'Connexion réussie';
			return $pdo;
		}catch(PDOException $e){
			$bug = 'Erreur : ' . $e->getMessage();
			echo  $bug;
		}
	}
	protected function reqFetchAll($sql, $values){
		//var_dump($values);
		$req = $this->db->prepare($sql);
		$req->execute($values);
		return $req->fetchAll(PDO::FETCH_ASSOC);
	}
	protected function reqExec($sql, $values){
		$req = $this->db->prepare($sql);
		$req->execute($values);
	}
	protected function reqCount($sql){
		$req = $this->db->query($sql);
		return $req->fetchColumn();
	}
} 