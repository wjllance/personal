CREATE TABLE IF NOT EXISTS raydium_swaps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_signature VARCHAR(100) NOT NULL,
    block_number BIGINT NOT NULL,
    block_time TIMESTAMP NOT NULL,
    owner_address VARCHAR(44) NOT NULL,
    in_token_mint VARCHAR(44) NOT NULL,
    in_token_amount DECIMAL(30, 9) NOT NULL,
    out_token_mint VARCHAR(44) NOT NULL,
    out_token_amount DECIMAL(30, 9) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_signature (transaction_signature)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
