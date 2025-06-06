package com.example.SkillWave;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.example.SkillWave.model")
public class SkillWaveApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkillWaveApplication.class, args);
	}

}
