<div class="col-md-8 ">
                <div class="rating-progress-bars p-3">
                    <div class="progress-1">
                        
                        <div class="progress cardFrame bg-orange">
                            <div class="progress-bar bg-gauge" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                style="width: <?=$sc->getProgressState('concepts')?>%;opacity:.8;"
                                aria-valuenow="<?=$sc->getProgressState('concepts')?>">
                                <?= $vocab['concepts'].': '.$sc->getProgressState('concepts')?>%
                            </div>
                        </div>    

                        <div class="progress cardFrame bg-orange">
                            <div class="progress-bar bg-gauge" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                style="width: <?=$sc->getProgressState('graphics')?>%;"
                                aria-valuenow="<?=$sc->getProgressState('graphics')?>">
                                <?= $vocab['graphics'].': '.$sc->getProgressState('graphics')?>% 
                            </div>
                        </div>

                        <div class="progress cardFrame bg-orange">
                            <div class="progress-bar bg-gauge" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                style="width: <?=$sc->getProgressState('scripts')?>%;"
                                aria-valuenow="<?=$sc->getProgressState('scripts')?>">
                                <?= $vocab['scripts'].': '.$sc->getProgressState('scripts')?>% 
                            </div>
                        </div>
                        <div class="progress cardFrame bg-orange">
                            <div class="progress-bar bg-gauge" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                style="width: <?=$sc->getProgressState('audio')?>%;" aria-valuenow="<?=$sc->getProgressState('audio')?>">
                                <?= $vocab['audio'].': '.$sc->getProgressState('audio')?>% 
                            </div>
                        </div>
                        <div class="progress cardFrame bg-orange">
                            <div class="progress-bar bg-gauge" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                style="width: <?=$sc->getProgressState('mapping')?>%;" aria-valuenow="<?=$sc->getProgressState('mapping')?>">
                                <?= $vocab['mapping'].': '.$sc->getProgressState('mapping')?>%
                            </div>
                        </div>
                        <div class="progress cardFrame bg-orange">
                            <div class="progress-bar bg-gauge" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                style="width: <?=$sc->getProgressState('graphics')?>%;"
                                aria-valuenow="<?=$sc->getProgressState('graphics')?>">
                                <?= $vocab['graphics'].': '.$sc->getProgressState('graphics')?>% 
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>