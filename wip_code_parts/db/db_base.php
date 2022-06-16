<?php
	private $activate, $vocab, $db;
	private $debug = true;
	private $host		= DB_HOSTNAME;
	private $dbname		= DB_NAME;
	private $username	= DB_USERNAME;
	private $password	= DB_PASSWORD;
	public $domain		= DOMAINE_NAME;
	public $adressOfficial = "5 rue de la sorbonne";

	//INITIALIZE
	public function __construct($vocab){
		$this->activate = true;
		$this->vocab = $vocab;
		$this->db = $this->db_connect();
	}
	//DATABASE MANAGER
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
?>
	
	