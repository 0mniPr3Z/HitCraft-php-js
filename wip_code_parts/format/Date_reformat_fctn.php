<?php
		public function reverseDating($timestamp){
		$actual	= time();
		$min	= 60;
		$hr		= $min * 60;
		$jr		= $hr * 24;
		$week	= $jr * 7;
		$passed	= $actual - $timestamp;

		if($passed < $min){
			$wordPassed =  $this->vocab['justnow'];
		}else if($passed < $hr){
			$wordPassed = $this->vocab['thereis'].' '.floor($passed / $min).' '.$this->vocab['minAgo'];
		}else if($passed < $jr){
			$wordPassed = $this->vocab['thereis'].' '.ceil($passed / $min / $hr).' '.$this->vocab['hrAgo'];
		}else if($passed < $week){
			$wordPassed = $this->vocab['thereis'].' '.floor($passed / $min / $hr).' '.$this->vocab['jrAgo'];
		}else{
			$wordPassed = $this->vocab['thereis'].' '.floor($passed / $min / $hr).' '.$this->vocab['jrAgo'];
		}

		return $wordPassed.', '.$this->vocab['atday'].' '.date($this->vocab['_dat_frmt'], $timestamp);
	}
	public function reverseShortDating($timestamp){
		$actual	= time();
		$min	= 60;
		$hr		= $min * 60;
		$jr		= $hr * 24;
		$week	= $jr * 7;
		$passed	= $actual - $timestamp;

		if($passed < $min){
			$wordPassed =  $this->vocab['justnow'];
		}else if($passed < $hr){
			$wordPassed = $this->vocab['thereis'].' '.floor($passed / $min).' '.$this->vocab['minAgo'];
		}else if($passed < $jr){
			$wordPassed = $this->vocab['thereis'].' '.ceil($passed / $min / $hr).' '.$this->vocab['hrAgo'];
		}else if($passed < $week){
			$wordPassed = $this->vocab['thereis'].' '.ceil($passed / $min / $hr).' '.$this->vocab['jrAgo'];
		}else{
			$wordPassed = $this->vocab['atday'].' '.date($this->vocab['_dat_frmt'], $timestamp);
		}
		return $wordPassed;
	}
	public function onlyDate($timestamp){
		return date($this->vocab['_dat_frmt2'], $timestamp);
	}
	
?>